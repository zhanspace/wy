<template>
    <div :style="style">
        <div class="contorll">
            <div class="header">1. 设定地理数据</div>
            <div class="formItem">
                <label>地图行数</label>
                <n-input-number placeholder="" :max="6" v-model:value="row" />
            </div>
            <div class="formItem">
                <label>地图列数</label>
                <n-input-number placeholder="" :max="6" v-model:value="col" />
            </div>
            <div class="formBtn">
                <n-button @click="genGeos">生成随机地图数据</n-button>
            </div>
        </div>
        <div class="contorll">
            <div class="header">2. 设定业务数据</div>
            <div class="formItem">
                <label>剥麻机数量</label>
                <n-input-number placeholder="" :max="3" v-model:value="machine" />
            </div>
            <div class="formItem">
                <label>田地到机器能耗系数</label>
                <n-input-number placeholder="" :show-button="false" v-model:value="fieldPower" />
            </div>
            <div class="formItem">
                <label>机器到仓库能耗系数</label>
                <n-input-number placeholder="" :show-button="false" v-model:value="repoPower" />
            </div>
            <div class="formBtn">
                <n-button @click="calcResult">计算最佳方案</n-button>
            </div>
        </div>
    </div>
</template>

<script>
import { NButton, NInputNumber } from 'naive-ui'

export default {
    name: 'Control',
    components: {
        NButton,
        NInputNumber,
    },
    computed: {
        geos() {
            return this.$store.state.geos
        },
        style() {
            return {
                height: window.innerHeight + 'px'
            }
        }
    },
    data() {
        return {
            row: 4,
            col: 4,
            machine: 2,
            fieldPower: 1,
            repoPower: 1,
        }
    },
    methods: {
        genGeos() {
            if (this.row <= 0 || this.col <= 0) {
                alert('行数/列数无效')
            }
            const geos = []
            for (let i = 0; i < this.row; i ++) {
                const row = []
                for (let j = 0; j < this.col; j ++) {
                    row.push(Math.pow(Math.round(Math.random() * 10), 2))
                }
                geos.push(row)
            }
            this.$store.commit('setGeos', geos)
        },
        calcResult() {
            if (!this.geos || this.geos.length <= 0) {
                alert('需要先生成地图数据')
                return 
            }
            const progress = document.getElementById('progress')
            progress.style.visibility = 'visible'
            // source到machine的能耗
            const calcSourceToMachine = (sourcePos, machinePos) => {
                const sourceToMachineCache = {}
                function calcSourceToMachineCore() {
                    const key = `${sourcePos[0]}_${sourcePos[1]}_${machinePos[0]}_${machinePos[1]}`
                    if (sourceToMachineCache[key]) return sourceToMachineCache[key]

                    const dist = Math.abs(sourcePos[0] - machinePos[0]) + Math.abs(sourcePos[1] - machinePos[1])
                    const consumption = dist * this.fieldPower * this.geos[sourcePos[1]][sourcePos[0]]
                    sourceToMachineCache[key] = consumption
                    return consumption
                }
                return calcSourceToMachineCore.apply(this)
            }
            // machine到仓库的距离
            const calcMachineToRepoDistance = (machinePos, repoPos) => {
                const machineToRepoDistanceCache = {}
                function calcMachineToRepoDistanceCore() {
                    const key = `${machinePos[0]}_${machinePos[1]}_${repoPos[0]}_${repoPos[1]}`
                    if (machineToRepoDistanceCache[key]) return machineToRepoDistanceCache[key]

                    const dist = Math.abs(machinePos[0] - repoPos[0]) + Math.abs(machinePos[1] - repoPos[1])
                    const consumption = dist * this.repoPower
                    machineToRepoDistanceCache[key] = consumption
                    return consumption
                }
                return calcMachineToRepoDistanceCore.apply(this)
            }
            // source到仓库的能耗
            const calcSourceToDist = (sourcePos, machinePosArr, repoPos) => {
                const sourceToDists = machinePosArr.map(machinePos => {
                    const sourceToMachine = calcSourceToMachine(sourcePos, machinePos)
                    const machineToRepoDist = calcMachineToRepoDistance(machinePos, repoPos)
                    const machineToRepo = machineToRepoDist * this.geos[sourcePos[1]][sourcePos[0]]
                    return sourceToMachine + machineToRepo
                })
                return Math.min(...sourceToDists)
            }
            // 当前所有节点到仓库的能耗
            const calcWholeSourceToDist = (sourcePosArr, machinePosArr, repoPos) => {
                let whole = 0
                sourcePosArr.forEach(sourcePos => {
                    whole += calcSourceToDist(sourcePos, machinePosArr, repoPos)
                })
                return whole
            }
            // 递归计算函数
            const calcMachineDeep = (sourcePosArr, machinePosArrs, repoPos) => {
                let bestResult = Number.POSITIVE_INFINITY
                let bestResultMachine = undefined
                let machinePosArr = []
                const calcDeep = (arr, index) => {
                    if (arr.length === 1) {
                        const now = arr[0]
                        for (let i = 0; i < now.length; i ++) {
                            machinePosArr[index] = now[i]
                            const result = calcWholeSourceToDist(sourcePosArr, machinePosArr, repoPos)
                            if (result < bestResult) {
                                bestResult = result
                                bestResultMachine = [...machinePosArr]
                            }
                        }
                        return
                    }
                    const now = arr[0]
                    for (let i = 0; i < now.length; i ++) {
                        machinePosArr[index] = now[i]
                        const newArr = arr.slice(1)
                        calcDeep(newArr, index + 1)
                    }
                }
                calcDeep(machinePosArrs, 0)
                return { result: bestResult, resultMachine: bestResultMachine }
            }
            const main = () => {
                // 位置节点数组
                const randomPosArr =  []
                for(let i = 0; i < this.row; i++) {
                    for(let j = 0; j < this.col; j++) {
                        randomPosArr.push([i, j])
                    }
                }
                const sourcePosArr = randomPosArr
                const repoPosArr = randomPosArr
                const machinePosArrs = []
                for(let i = 0; i < this.machine; i++) {
                    machinePosArrs.push(randomPosArr)
                }

                // 开始计算
                let bestResult = Number.POSITIVE_INFINITY
                let bestResultRepo = undefined
                let bestResultMachine = undefined

                // let i = 0
                for (const repoPos of repoPosArr) {
                    // progress.innerText = `当前进度${i++} / ${repoPosArr.length - 1}`
                    const { result, resultMachine } = calcMachineDeep(sourcePosArr, machinePosArrs, repoPos)
                    if (result < bestResult) {
                        bestResult = result
                        bestResultMachine = resultMachine
                        bestResultRepo = repoPos
                    }
                }
                progress.style.visibility = 'hidden'
                return {
                    bestResult,
                    bestResultMachine,
                    bestResultRepo
                }
            }
            setTimeout(() => {
                const result = main()
                this.$store.commit('setResult', result)
            }, 100)
        }
    }
}
</script>

<style scoped>
    .header {
        background: #111;
        padding: 10px 10px;
        font-size: larger;
        color: #777;
    }
    .formItem {
        display: flex;
        padding: 4px 24px;
    }
    .formItem label {
        line-height: 34px;
        margin-right: 10px;
        width: 140px;
    }
    .formBtn {
        display: flex;
        justify-content: flex-end;
        padding-top: 4px;
        padding-bottom:8px;
        padding-right: 24px;
    }
</style>