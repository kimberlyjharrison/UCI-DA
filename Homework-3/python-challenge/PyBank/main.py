# UCIRV201902DATA3
# Homework 3, Python PyBank Script
# Submitted by Kim Harrison

#import dependencies
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

    #initialize variables for delta calculations
    maxGrowth = 0
    maxLoss = 0 

    #read csv file into lists
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
    
    #Perform analysis
    numMonths = len(monthList)
    netProfit = sum(profitList)
    avgChange = (sum(changeList) / (numMonths - 1))

#Print results to terminal
print("---------------------------------------------------------------------------")
print("Financial Analysis\n")
print(f"Total Months: {numMonths}")
print(f"Net Profits: $ {netProfit:0.2f}")
print(f"Average Change Month-over-Month: $({avgChange:0.2f})")
print(f"Greatest Month-over-Month Profit Increase: $({maxGrowth:0.2f}) in {maxGrowthMonth}")
print(f"Greatest Month-over-Month Profit Decrease: $({maxLoss:0.2f}) in {maxLossMonth}")
print("---------------------------------------------------------------------------")

#create new .txt file with financial analysis results
output_file = os.path.join("financialAnalysis.txt")

with open("financialAnalysis.txt", "w") as text_file:
    text_file.write("---------------------------------------------------------------------------\n")
    text_file.write("Financial Analysis\n")
    text_file.write(f"Total Months: {numMonths}\n")
    text_file.write(f"Net Profits: $ {netProfit:0.2f}\n")
    text_file.write(f"Average Change Month-over-Month: $({avgChange:0.2f})\n")
    text_file.write(f"Greatest Month-over-Month Profit Increase: $({maxGrowth:0.2f}) in {maxGrowthMonth}\n")
    text_file.write(f"Greatest Month-over-Month Profit Decrease: $({maxLoss:0.2f}) in {maxLossMonth}\n")
    text_file.write("---------------------------------------------------------------------------")