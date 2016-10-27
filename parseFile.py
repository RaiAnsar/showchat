import MySQLdb
db        = MySQLdb.connect("127.0.0.1", "root", "meeseeks", "showchat")
cursor    = db.cursor()
movieFile = open("movies.list", "r")

id = 0
prevName = ""
for line in movieFile:
    try:
        id += 1
        name = ""
        if line[0] == "\"":
            firstIndex  = 0
            secondIndex = line[1:].find("\"") + 2
            name        = line[firstIndex:secondIndex]
        else:
            lastIndex = line.find("(")
            name      = line[:lastIndex]
        #print(name)
        #name         = 
        if name == prevName:
            continue
        prevName = name
        firstParenIndex = line.find("(") + 1
        secondParenIndex = line.find(")")
        if firstParenIndex > secondParenIndex:
            firstParenIndex = 0
            secondParenIndex = 0
        dateReleased  = line[firstParenIndex:secondParenIndex]
        genre        = ""
        cursor.execute("""INSERT into Movie VALUES(%s, %s, %s, %s)""", \
                      (name, id, dateReleased, genre))
        print(id)
        db.commit()
    except:
       db.rollback()

cursor.close()
