### 背景
将当前区域划分为n*m的矩阵，每个单元格代表一个子区域，每个子区域有自己的产能,记录为S[n][m]
计划共设立k个剥麻机，1个中央仓库，单元格到机器位置的能耗功率为Pm，机器到中央仓库位置的能耗功率为Pr

### objective function
最优解的计算过程，即每个区域将货品最终送到中央仓库的能耗之和，在所有可能方案中取最小值

单个区域将货品最终送到中央仓库的能耗拆解为两部分：
1. 单元格位置送到机器位置的路径 * 能耗功率为Pm * 产能S[n][m]
2. 机器位置送到仓库位置的路径 * 能耗功率为Pr * 产能S[n][m]

这是口语化表达，应该很好立即，你自己转换为latex公式吧。我没装相关软件

### various constraints
这是啥，这玩意的约束变量，不就是入参的那几个东西？不懂，这似乎不是程序概念，感觉是学术词汇吧，我没写过论文，不懂这种套路。

### 技术方案
已知，当前一个仓库和k个机器，集合固定的区域划分情况，对仓库和机器所有可能的位置进行穷举模拟，找出最优解。算法复杂度O(n^(k+1))

潜在的优化空间：部分case的计算过程可以忽略，比如A机器在位置(1,2),B机器在位置(2,1)的情况和B机器在位置(1,2),A机器在位置(2,1)的情况是没有区别的，可以进行算法剪裁，将计算过程降低一部分，但不能从本质上降低算法复杂度

分析：该算法在离线环境下生成，各个入参的浮动范围比较小，且执行场景固定时，结果保持一致，不需要重复计算。目前测试5*5的区域矩阵，3个剥麻机的场景下，耗时20s。对于商业环境，计算机执行耗时几小时内都是可以接受的。