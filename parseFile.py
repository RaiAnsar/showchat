import MySQLdb
db        = MySQLdb.connect("127.0.0.1", "root", "meeseeks", "showchat")
cursor    = db.cursor()
movieFile = open("genres.list", "r")

alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
movieId = 0
prevName = ""
prevDateReleased = ""
showId = 0
for line in movieFile:
    try:
	shouldAdd = True
	isRepeat = False
	isTVShow = False
	
        
        name = ""
        if line[0] == "\"":
            firstIndex  = 0
            secondIndex = line[1:].find("\"") + 2
            name        = line[firstIndex:secondIndex]
        else:
            lastIndex = line.find("(")
            name      = line[:lastIndex]
       
        
        prevName = name
        firstParenIndex = line.find("(") + 1
        secondParenIndex = line.find(")")
        if firstParenIndex > secondParenIndex:
            firstParenIndex = 0
            secondParenIndex = 0
	genre = ""
        dateReleased  = line[firstParenIndex:secondParenIndex]
	prevDateReleased = dateReleased
	if name == prevName and prevDateReleased == dateReleased:
            isRepeat = True
	thirdParenIndex = line[secondParenIndex+1:].find("(")
	checkCurlyBrace = line[secondParenIndex+1:].find("{")
	if thirdParenIndex == -1 and checkCurlyBrace == -1:
		genre = line[secondParenIndex+1:].lstrip(' ')
		movieId += 1
	elif thirdParenIndex == -1:
		skipCurlyBrace = line[checkCurlyBrace:].find("} ")
		genre = line[skipCurlyBrace+1:].lstrip(' ')
		movieId += 1
	elif thirdParenIndex != -1:
		fourthParenIndex = line[thirdParenIndex+1:].find(')')
		typeOfMovie = line[thirdParenIndex+1:fourthParenIndex]
		if typeOfMovie == 'TV':
			isTVShow = True
			showId +=1
		else:
			shouldAdd = False
		genre = line[fourthParenIndex+1:].lstrip(' ')
		
	if shouldAdd is False:
		continue		
				
        if isTVShow is False and isRepeat is False:
        	cursor.execute("""INSERT into Movie VALUES(%s, %s, %s, %s)""", \
                      (name, movieId, dateReleased, genre))
	elif isTVShow is True and isRepeat is False:
		cursor.execute("""INSERT into TVShow VALUES(%s, %s, %s, %s)""", \
		      (name, showId, dateReleased, genre))
	elif isRepeat is True and isTVShow is False:
		cursor.execute("""UPDATE Movie SET Genre=concat(Genre,',%s') WHERE ID=%s""", \
 		      (genre, movieId))
	elif isRepeat is True and isTVShow is True:
		cursor.execute("""UPDATE TVShow SET Genre=concat(Genre,',%s') WHERE ID=%s""", \
 		      (genre, showId))
        
        db.commit()
    except:
       db.rollback()
print(movieId)
print(showId)
cursor.close()
