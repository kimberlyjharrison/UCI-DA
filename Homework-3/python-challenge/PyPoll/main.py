#UCIRV201902DATA3
#Homework 3, Python PyPoll Script
#Submitted by Kim Harrison
#Objective: Using provided election data CSV, detemrine outcome of election
#Skills: Dictionaries

import os
import csv

#read csv file
csvpath = os.path.join("..", "Resources", "election_data.csv")

with open(csvpath, newline='') as csvfile:
    csvreader = csv.reader(csvfile, delimiter=',')
    csv_header = next(csvreader)

#initialize new nested dictionary to track data
#Key = Voter ID, value = County, Candidate
    voterDict={}
    for row in csvreader:
        voterDict[row[0]] = {}
        voterDict[row[0]]['county'] = row[1]
        voterDict[row[0]]['candidate'] = row[2]

#determine total number of votes.  yikes thats a lot of votes!
totalVotes = len(voterDict)

#initialize list to track unique Candidates that received votes
candidateList = []

#add all candidates to a candidate list using a for-loop
for x in voterDict:
    candidateList.append(voterDict[x]['candidate'])

#create new list of UNIQUE candidates using the 'set' method   
candidates = set(candidateList)

#initialize dictionary to keep track of candidates (key) and votes received (value)
voteDict={}

#loop through the data to count candidate votes
for candidate in candidates: #loop through each candidate's name
    voteDict[candidate] = {} #create dictionary to keep track of each candidates votes
    counter = 0 #inialize counter
    for row in voterDict: #loop through all data to count votes
        if voterDict[row]['candidate'] == candidate: #if the candidate is voted for, count the vote
            counter = counter + 1
            voteDict[candidate]['votes'] = counter #add vote count to dictionary
            voteDict[candidate]['percentage'] = counter/totalVotes * 100  #calculate percentage of total votes

#this part took me a long time to figure out, and right around here is where i realized that I
#easily could have done this all using the candidateList created  in line 29.  Oh well, I need practice with dicts!
#Call the sorted method to organize the dictionary in descending values by vote count
sorted_d = sorted(voteDict.items(), key=lambda item: item[1]['votes'], reverse=True)

#print results to terminal
print("-------------------------------------------------------\n")
print("Election Results\n")
print("-------------------------------------------------------\n")
for name in range(len(sorted_d)): #note: sorted_d is a list, not a dict!
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
