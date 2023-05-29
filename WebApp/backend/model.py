from ortools.sat.python import cp_model
import sys
import json
# IN THIS MODEL WE ACCOMPLISH THE FOLLOWING:
# TAS CAN TEACH A CERTAIN NUMBER OF SESSIONS FOR EACH COURSE


def main():
    # This program tries to find an optimal taCourseAssignment of nurses to shifts
    # (3 shifts per day, for 7 days), subject to some constraints (see below).
    # Each nurse can request to be assigned to specific shifts.
    # The optimal taCourseAssignment maximizes the number of fulfilled shift requests.
    parsed = json.loads(sys.argv[1])
    arr = parsed[5]
    successArray = []

    # (5 Slots per day, 3 courses and we have 5 TAs)
    num_tas = parsed[0]
    num_days = parsed[1]
    num_slots = parsed[2]
    num_courses = parsed[3]
    num_tutorialGroups = parsed[4]
    all_tas = range(num_tas)
    all_days = range(num_days)
    all_slots = range(num_slots)
    all_courses = range(num_courses)
    all_tutorialGroups = range(num_tutorialGroups)

    # This is the taCourseAssignment matrix which tells us which TA is assigned to which course AND the number of sessions he should teach
    # row : TA, col : Course

    taCourseAssignment = parsed[5]
    # successArray.append(taCourseAssignment)

    # Shows Number of Tutorial Groups for each course

    """ taCourseAssignment = [
    [24, 24, 24],
        [24, 24, 24],
        [24, 24, 24],
        [24, 24, 24],
        [24, 24, 24]

        [9, 6, 0],
        [3, 6, 0],
        [3, 0, 12],
        [9, 0, 0],
        [6, 0, 6]
        [[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
         [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
         [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
         [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
         [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
         ],
        [2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2],
        [0, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2]

        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ]"""

    # TA day off pereferance matrix (top 2 scores are chosen as day off)
    # row : TA, col : Day
    # perefrence ranges from 1 to 6 (6 being the highest and 1 being the lowest)
    # Highest 2 applicable scores are chosen as day off
    taDayOffPreference = parsed[6]

    # TA number of sessions in each day preference matrix (max: 4, min: 2)
    # row : TA, col : Day
    sessionNumberPreference = parsed[7]
    sumPref = 0
    for i in range(len(sessionNumberPreference)):
        for j in range(len(sessionNumberPreference[i])):
            sumPref = sumPref + 4

    # Courses are either available in a slot or not based on the schedule
    # In this particular day, Course 1 is available in slot 2,3,4 but not in slots 1 and 5
    # and course 2 is available in slot 1,2 but not in slot 3,4,5 and so on
    # you can read this 4d matrix as a table with 6 rows and 5 columns containing tuples that are 2d arrays
    # The Tuples rows are tutorial groups and the columns are courses for which the tutorual groups are taking
    #
    # Assume we have 4 tutorial groups
    schedule = parsed[8]

    firstDayForCourseTutorialFlag = [
        [True]*num_tutorialGroups for i in range(num_courses)]
    firstDayForCourseTutorial = [
        [[0]*2 for j in range(num_tutorialGroups)] for i in range(num_courses)]
    tutNoForEachCourseGroup = [
        [0]*num_tutorialGroups for i in range(num_courses)]

    for i in range(len(schedule)):
        for j in range(len(schedule[i])):
            for k in range(len(schedule[i][j])):
                for z in range(len(schedule[i][j][k])):
                    if (schedule[i][j][k][z] == 1):
                        if (firstDayForCourseTutorialFlag[k][z] == True):
                            firstDayForCourseTutorial[k][z][0] = i
                            firstDayForCourseTutorial[k][z][1] = j
                            firstDayForCourseTutorialFlag[k][z] = False
                        tutNoForEachCourseGroup[k][z] = tutNoForEachCourseGroup[k][z] + 1

    # Creates the model.

    model = cp_model.CpModel()

    # Creates  variables.
    # tutorial[(ta, day, slot, course)] is an array of boolean variables, which is True
    # model.NewBoolVar('tutorial%i%id%is%ic%i' % (ta, day, slot, course)) is just creating a variable name for our problem to be printed
    tutorials = {}
    for ta in all_tas:
        for day in all_days:
            for slot in all_slots:
                for course in all_courses:
                    for tutorialGroup in all_tutorialGroups:
                        tutorials[(ta, day, slot, course, tutorialGroup)] = model.NewBoolVar(
                            'ta%id%is%ic%itg%i' % (ta, day, slot, course, tutorialGroup))
    dayOff = {}
    for ta in all_tas:
        for day in all_days:
            dayOff[(ta, day)] = model.NewBoolVar(
                'ta%id%ioff' % (ta, day))
    maxTut = {}
    for ta in all_tas:
        for i in range(len(sessionNumberPreference[ta])):
            maxTut[(ta, i)] = model.NewIntVar(0, 4, 'day%iMaxTut' % (i))

    for ta in all_tas:
        for day in all_days:
            allTut = []
            for slot in all_slots:
                for course in all_courses:
                    for tutorialGroup in all_tutorialGroups:
                        allTut.append(
                            tutorials[(ta, day, slot, course, tutorialGroup)])
            model.Add(sum(allTut) <= maxTut[(ta, day)])

    sumMaxTut = []
    for ta in all_tas:
        for i in range(len(sessionNumberPreference[ta])):
            sumMaxTut.append(maxTut[(ta, i)] - sessionNumberPreference[ta][i])

    # Each tutorialGroup has to be assigned to exactly one TA in .
    for day in all_days:
        for slot in all_slots:
            for course in all_courses:
                for tutorialGroup in all_tutorialGroups:
                    if (schedule[day][slot][course][tutorialGroup] == 0):
                        continue
                    constraints = []
                    for ta in all_tas:
                        constraints.append(
                            tutorials[(ta, day, slot, course, tutorialGroup)])
                    model.Add(sum(constraints) == 1)

    # Each TA is assigned at most one tutorialGroup in one slot.
    for day in all_days:
        for ta in all_tas:
            for slot in all_slots:
                constraints = []
                for course in all_courses:
                    for tutorialGroup in all_tutorialGroups:
                        constraints.append(
                            tutorials[(ta, day, slot, course, tutorialGroup)])
                model.Add(sum(constraints) <= 1)

    # Each TA can teach a certain number of sessions for every course as indicated by the taCourseAssignment matrix
    for ta in all_tas:
        for course in all_courses:
            for tutorialGroup in all_tutorialGroups:
                sessionConstraints = []
                for day in all_days:
                    for slot in all_slots:
                        sessionConstraints.append(
                            tutorials[(ta, day, slot, course, tutorialGroup)])
                model.Add(sum(sessionConstraints) <=
                          taCourseAssignment[ta][course])
    # For each course, each tutorialGroup must have the same TA at any day and any slot
    for tutorialGroup in all_tutorialGroups:
        for course in all_courses:
            for ta in all_tas:
                model.Add(sum([tutorials[(ta, day, slot, course, tutorialGroup)]
                               for day in all_days for slot in all_slots])
                          == tutNoForEachCourseGroup[course][tutorialGroup]).OnlyEnforceIf(tutorials[(ta, firstDayForCourseTutorial[course][tutorialGroup][0], firstDayForCourseTutorial[course][tutorialGroup][1], course, tutorialGroup)])
                model.Add(sum([tutorials[(ta, day, slot, course, tutorialGroup)]
                               for day in all_days for slot in all_slots])
                          == 0).OnlyEnforceIf(tutorials[(ta, firstDayForCourseTutorial[course][tutorialGroup][0], firstDayForCourseTutorial[course][tutorialGroup][1], course, tutorialGroup)].Not())

    # Each TA may indicate a certain number of sessions in each day as indicated by the sessionNumberPreference matrix
    for ta in all_tas:
        for day in all_days:
            sessionConstraints = []
            for slot in all_slots:
                for course in all_courses:
                    for tutorialGroup in all_tutorialGroups:
                        sessionConstraints.append(
                            tutorials[(ta, day, slot, course, tutorialGroup)])
            model.Add(sum(sessionConstraints) <=
                      4)

    # TA cannot be assigned to a course if they are not teaching that course
    TACourseMisMatch = []
    for day in all_days:
        for ta in all_tas:
            for tutorialGroup in all_tutorialGroups:
                for course in all_courses:
                    if (taCourseAssignment[ta][course] > 0):
                        continue
                    for slot in all_slots:
                        TACourseMisMatch.append(
                            tutorials[(ta, day, slot, course, tutorialGroup)])
        model.Add(sum(TACourseMisMatch) == 0)

    # TA can only be assigned to a course in a slot if the course and tutorialGroup is available in that slot
    SlotCourseMisMatch = []
    for day in all_days:
        for slot in all_slots:
            for course in all_courses:
                for tutorialGroup in all_tutorialGroups:
                    if (schedule[day][slot][course][tutorialGroup] > 0):
                        continue
                    for ta in all_tas:
                        SlotCourseMisMatch.append(
                            tutorials[(ta, day, slot, course, tutorialGroup)])
    model.Add(sum(SlotCourseMisMatch) == 0)

    # TA should have 2 days off in a week depending on highest applicable pereferance
    # First we must set day off limit to 2

    for ta in all_tas:
        dayOffLimit = []
        for day in all_days:
            dayOffLimit.append(dayOff[(ta, day)])
        model.Add(sum(dayOffLimit) == 2)

    # ------------------------------ OBJECTIVE FUNCTION ------------------------------------
    # We must calculate all scores of all days off from the taDayOffPreference matrix

    dayOffScore = []
    for ta in all_tas:
        for day in all_days:
            dayOffScore.append(
                taDayOffPreference[ta][day]*dayOff[(ta, day)])
    model.Maximize(sum(dayOffScore) + (1/sumPref)*sum(sumMaxTut))
    # ------------------------------ OBJECTIVE FUNCTION ------------------------------------

    # If the day is off for the TA, then he should not be assigned to any tutorialGroup in that day
    for ta in all_tas:
        for day in all_days:
            for slot in all_slots:
                for course in all_courses:
                    for tutorialGroup in all_tutorialGroups:
                        model.AddImplication(dayOff[(ta, day)],
                                             tutorials[(ta, day, slot, course, tutorialGroup)].Not())

    # pylint: disable=g-complex-comprehension

    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    counter = 0
    counterd = 0
    numOfSessions = [[0]*num_days for i in range(num_tas)]

    if status == cp_model.OPTIMAL:
        # create output shecdule
        outputSchedule = []
        for day in all_days:
            outputSchedule.append([])
            for slot in all_slots:
                outputSchedule[day].append([])
                for course in all_courses:
                    for tutorialGroup in all_tutorialGroups:
                        for ta in all_tas:
                            if solver.Value(tutorials[(ta, day, slot, course, tutorialGroup)]) == 1:
                                outputSchedule[day][slot].append(
                                    [course, tutorialGroup, ta])
        successArray.append(outputSchedule)
        # create list of tutorials for each TA
        outputTutorials = []
        for ta in all_tas:
            outputTutorials.append([])
            for day in all_days:
                for slot in all_slots:
                    for course in all_courses:
                        for tutorialGroup in all_tutorialGroups:
                            if solver.Value(tutorials[(ta, day, slot, course, tutorialGroup)]) == 1:
                                outputTutorials[ta].append(
                                    [day, slot, course, tutorialGroup, ta])
        successArray.append(outputTutorials)

        outputDayOffTA = []
        for ta in all_tas:
            outputDayOffTA.append([])
            for day in all_days:
                if solver.Value(dayOff[(ta, day)]) == 1:
                    outputDayOffTA[ta].append(day)
        successArray.append(outputDayOffTA)

        outputDayOffDay = []
        for day in all_days:
            outputDayOffDay.append([])
            for ta in all_tas:
                if solver.Value(dayOff[(ta, day)]) == 1:
                    outputDayOffDay[day].append(ta)
        successArray.append(outputDayOffDay)
        # print(outputSchedule)
        # print(outPutDayOff)

    else:
        successArray.append("FAILURE")

    # print("actual sessions assigned to each TA:", numOfSessions)
    # print("sessionsPreference:", sessionNumberPreference)

    sys.stdout.write(json.dumps(successArray))
    # parsed = json.load(sys.stdin)


if __name__ == '__main__':
    main()
