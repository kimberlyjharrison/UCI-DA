# UCIRV201902DATA3
# Homework 3, Python PyBank Script
# Submitted by Kim Harrison

#import 
import os
import csv

#initialize empty lists
monthList = []
profitList = []
changeList = []


# Read in csv file
csvpath = os.path.join("..", "Resources", "budget_data.csv")

with open(csvpath, newline='') as csvfile:


    csvreader = csv.reader(csvfile, delimiter=',')
    csv_header = next(csvreader)

    maxGrowth = 0
    maxLoss = 0 

    for row in csvreader:
        monthList.append(row[0])
        profitList.append(float(row[1]))
        
    for x in (range(len(profitList)-1)):
        deltaProfit = profitList[x+1] - profitList[x]
        changeList.append(deltaProfit)
        if deltaProfit > maxGrowth:
            maxGrowth = deltaProfit
            maxGrowthMonth = monthList[x+1]
        if deltaProfit < maxLoss:
            maxLoss = deltaProfit
            maxLossMonth = monthList[x+1]
            
        
    numMonths = len(monthList)
    netProfit = sum(profitList)
    avgChange = (sum(changeList) / (numMonths - 1))


print("---------------------------------------------------------------------------")
print("Financial Analysis\n")
print(f"Total Months: {numMonths}")
print(f"Net Profits: $ {netProfit:0.2f}")
print(f"Average Change Month-over-Month: $({avgChange:0.2f})")
print(f"Greatest Month-over-Month Profit Increase: $({maxGrowth:0.2f}) in {maxGrowthMonth}")
print(f"Greatest Month-over-Month Profit Decrease: $({maxLoss:0.2f}) in {maxLossMonth}")
print("---------------------------------------------------------------------------")


# numbers = [23.23, 0.123334987, 1, 4.223, 9887.2]

# for number in numbers:
#     print(f'{number:9.4f}')


# Financial Analysis
# ----------------------------
# Total Months: 86S
# Total: $38382578
# Average  Change: $-2315.12
# Greatest Increase in Profits: Feb-2012 ($1926159)
# Greatest Decrease in Profits: Sep-2013 ($-2196167)
