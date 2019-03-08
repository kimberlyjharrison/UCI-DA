# UCIRV201902DATA3
# Homework 3, Python PyBank Script
# Submitted by Kim Harrison

#import 
import os
import csv

#initialize empty lists
monthList = []
profitList = []

#define function to calculate financial stats
def financeStats(months, profits):
    numMonths = len(months)
    netTotal = sum(profits)
    avgProfit = (netTotal / numMonths)
    print(avgProfit)

# Read in csv file
csvpath = os.path.join("..", "Resources", "budget_data.csv")

with open(csvpath, newline='') as csvfile:

    csvreader = csv.reader(csvfile, delimiter=',')
    csv_header = next(csvreader)

    for row in csvreader:
        monthList.append(row[0])
        profitList.append(float(row[1]))

    financeStats(monthList, profitList)





#netProfit = sum(profitList)
#print(netProfit)

# print(financeStats(monthList, profitList))




#print(f"The total number of months is {len(monthList)}")