#UCIRV201902DATA3
#Homework 3, Python PyPoll Script
#Submitted by Kim Harrison
#Objective: Using provided election data CSV, detemrine outcome of election
#Skills: python Lits, Dictionaries

# import os
# import csv

# csvpath = os.path.join("..", "Resources", "election_data.csv")

# with open(csvpath, newline='') as csvfile:
#     csvreader = csv.reader(csvfile, delimiter=',')
#     csv_header = next(csvreader)

#     voterDict={}
#     for row in csvreader:
#         voterDict[row[0]] = row[1:]

# totalVotes = len(voterDict)
# print(f"Total Votes: {totalVotes}")

# print(voterDict)

import os
import csv
from collections import OrderedDict

csvpath = os.path.join("..", "Resources", "election_data.csv")

with open(csvpath, newline='') as csvfile:
    csvreader = csv.reader(csvfile, delimiter=',')
    csv_header = next(csvreader)

    voterDict={}
    for row in csvreader:
        voterDict[row[0]] = {}
        voterDict[row[0]]['county'] = row[1]
        voterDict[row[0]]['candidate'] = row[2]

totalVotes = len(voterDict)

candidateList = []
for x in voterDict:
    candidateList.append(voterDict[x]['candidate'])
    
candidates = set(candidateList)
voteDict={}

for candidate in candidates:
    voteDict[candidate] = {}
    counter = 0
    for row in voterDict:
        if voterDict[row]['candidate'] == candidate:
            counter = counter + 1
            voteDict[candidate]['votes'] = counter
            voteDict[candidate]['percentage'] = counter/totalVotes * 100  

sorted_d = sorted(voteDict.items(), key=lambda item: item[1]['votes'], reverse=True)
print(sorted_d)

print("-------------------------------------------------------\n")
print("Election Results\n")
print("-------------------------------------------------------\n")
for name in range(len(sorted_d)):
    print(f"{sorted_d[name][0]}: {sorted_d[name][1]['percentage']:0.2f}% ({sorted_d[name][1]['votes']})")
print("-------------------------------------------------------\n")
print(f"Winner: {sorted_d[0][0]}\n")
print("-------------------------------------------------------")

#create new .txt file with election results
output_file = os.path.join("electionResults.txt")

with open("electionResults.txt", "w") as text_file:
    text_file.write("-------------------------------------------------------\n")
    text_file.write("Election Results\n")
    text_file.write("-------------------------------------------------------\n")
    for name in range(len(sorted_d)):
        text_file.write(f"{sorted_d[name][0]}: {sorted_d[name][1]['percentage']:0.2f}% ({sorted_d[name][1]['votes']})\n")
    text_file.write("-------------------------------------------------------\n")
    text_file.write(f"Winner: {sorted_d[0][0]}\n")
    text_file.write("-------------------------------------------------------")
