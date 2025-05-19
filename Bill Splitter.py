#Gabriel Colonna
#Bill Splitter

#The purpose is to split the bill based on what each person ate.
#The tip is calculated and divided evenly by the amount of people.
#It is then going to show how much each person pays including tip.

#Setup
print("Welcome to the Bill Splitter! This app is useful for if you forgot to ask the server to split the bill."
                "You can now calculate how much each person pays including the tip at the end.")

def main():
    dictionary={}
    name_list= []
    print("Welcome to the Bill Splitter")

#Ask for amount of people and add each name onto a list.
    total_people= int(input("How many people will be splitting the bill?\n"))
    if(total_people==0):
        print("Invalid Selection. Restart the program.")
        return
    for i in range(total_people):
        names= input("Name for guest?\n")
        names=names.title()
        name_list.append(names)

#Call function for figuring out prices which then gets added into the dictionary        
    for i in range(total_people):
        person_price= eating(name_list[0+i])
        dictionary[name_list[0+i]]=person_price

#Calculate the total based on the math on my eating() function. Uses dictionary to add up. 
    total=0
    for key in dictionary.keys():
        total+=dictionary[key]
    tip_unit=tip_calculate(total, total_people)

#Final step was to display the new numbers
    print("\nThe bill has been calculated... ")
    
    print("--------------------------------------------------------------------------")
    print("Subtotal","%.2f"%total, sep=": $")
    finalized_total=0
    
    for key in dictionary.keys():
        print(key,   ("%.2f"%(dictionary[key]+tip_unit)) , sep=": $")
        finalized_total+=(dictionary[key]+tip_unit)
        
    print("Total", "%.2f"%finalized_total,sep=": $")
    print("--------------------------------------------------------------------------")
    

#This function will ask for the user's input for what each guest ate and how much it was.
def eating(person):
    diction= []
    ate= int(input("How many items did " + person + " consume?\n"))
    num=0
    for i in range(ate):
        what = input("What was the item?\n")
        ask= float(input("How much was it?\n"))
        num+= ask
    return num

#This function will calculate the tip for the total and then divide it evenly per person.
def tip_calculate(total, people):

    tip= float(input("How much would you like to leave for tip? (Do not include percentage sign) \n"))
    
    if (tip <= 0):
        print("You are cheap. ")
        return 0
    
    else:
        tip = tip * 0.01
        tip_amount = total * tip
        per_person = tip_amount / people
        return per_person

#Just some extra fun
def start():
    question = input("Are you ready to use the bill splitter?\n")
    question=question.lower()
    if (question == "yes"):
        main()
    elif (question=="no"):
        print("It doesn't matter, we will use it anyways\n")
        main()
    else:
        print("You seem to be confused, we are using the app.\n")
        main()
        
start()
