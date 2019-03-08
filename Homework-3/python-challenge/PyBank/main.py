# UCIRV201902DATA3
# Homework 3, Python PyBank Script
# Submitted by Kim Harrison

#import 
import os
import csv

#initialize empty lists
monthList = []
profitList = []

# Read in csv file
csvpath = os.path.join("..", "Resources", "budget_data.csv")

with open(csvpath, newline='') as csvfile:

    csvreader = csv.reader(csvfile, delimiter=',')
    csv_header = next(csvreader)

    for row in csvreader:
        monthList.append(row[0])
        profitList.append(float(row[1]))


    #calcuclate number of months and total profit
    numMonths = len(monthList)
    netProfit = sum(profitList)

    print(numMonths, netProfit)



# Financial Analysis
# ----------------------------
# Total Months: 86
# Total: $38382578
# Average  Change: $-2315.12
# Greatest Increase in Profits: Feb-2012 ($1926159)
# Greatest Decrease in Profits: Sep-2013 ($-2196167)
