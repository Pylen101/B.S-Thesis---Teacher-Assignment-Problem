# """Nurse scheduling problem with shift requests."""
from ortools.sat.python import cp_model
# IN THIS MODEL WE ACCOMPLISH THE FOLLOWING:
# TAS CAN TEACH A CERTAIN NUMBER OF SESSIONS FOR EACH COURSE


def main():
    # This program tries to find an optimal taCourseAssignment of nurses to shifts
    # (3 shifts per day, for 7 days), subject to some constraints (see below).
    # Each nurse can request to be assigned to specific shifts.
    # The optimal taCourseAssignment maximizes the number of fulfilled shift requests.

    # (5 Slots per day, 3 courses and we have 5 TAs)
    num_tas = 5
    num_days = 6
    num_slots = 5
    num_courses = 3
    num_tutorialGroups = 5
    all_tas = range(num_tas)
    all_days = range(num_days)
    all_slots = range(num_slots)
    all_courses = range(num_courses)
    all_tutorialGroups = range(num_tutorialGroups)

    # This is the taCourseAssignment matrix which tells us which TA is assigned to which course AND the number of sessions he should teach
   # row : TA, col : Course

    taCourseAssignment = [
        [9, 6, 0],
        [3, 6, 0],
        [3, 0, 0],
        [9, 0, 0],
        [6, 0, 12]
    ]
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
    ]"""

    # TA day off pereferance matrix (top 2 scores are chosen as day off)
    # row : TA, col : Day
    # perefrence ranges from 1 to 6 (6 being the highest and 1 being the lowest)
    # Highest 2 applicable scores are chosen as day off
    taDayOffPreference = [
        [6, 5, 3, 4, 2, 1],
        [1, 2, 6, 5, 4, 3],
        [1, 2, 3, 4, 5, 6],
        [1, 2, 3, 4, 6, 5],
        [1, 6, 5, 4, 3, 2],
    ]

    # Courses are either available in a slot or not based on the schedule
    # In this particular day, Course 1 is available in slot 2,3,4 but not in slots 1 and 5
    # and course 2 is available in slot 1,2 but not in slot 3,4,5 and so on
    # you can read this 4d matrix as a table with 6 rows and 5 columns containing tuples that are 2d arrays
    # The Tuples rows are tutorial groups and the columns are courses for which the tutorual groups are taking
    #
    # Assume we have 4 tutorial groups
    schedule = [
        # sat
        [[[0, 0, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 1]],
         [[0, 0, 0, 1, 1], [0, 0, 1, 0, 0], [0, 1, 0, 0, 0]],
         [[0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
         [[0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 1]],
         [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
         ],
        # sun
        [[[0, 0, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 1]],
         [[0, 0, 0, 1, 1], [0, 0, 1, 0, 0], [0, 1, 0, 0, 0]],
         [[0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
         [[0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 1]],
         [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
         ],
        # mon
        [[[0, 0, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 1]],
         [[0, 0, 0, 1, 1], [0, 0, 1, 0, 0], [0, 1, 0, 0, 0]],
         [[0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
         [[0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 1]],
         [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
         ],
        # tue
        [[[0, 0, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 1]],
         [[0, 0, 0, 1, 1], [0, 0, 1, 0, 0], [0, 1, 0, 0, 0]],
         [[0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
         [[0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 1]],
         [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
         ],
        # wed
        [[[0, 0, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 1]],
         [[0, 0, 0, 1, 1], [0, 0, 1, 0, 0], [0, 1, 0, 0, 0]],
         [[0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
         [[0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 1]],
         [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
         ],
        # thu
        [[[0, 0, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 1]],
         [[0, 0, 0, 1, 1], [0, 0, 1, 0, 0], [0, 1, 0, 0, 0]],
         [[0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
         [[0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 1]],
         [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
         ],
    ]

    # For visualisation purposes, we will print the schedule matrix in a more readable format
    # Assume the 5 courses are: 0, 1, 2, 3, 4 which correspond to MATH101, PHYS101, CSEN101, CHEM101, GERM101
    for i in range(len(schedule)):
        if (i == 0):
            print('|     Sat      |')
        elif (i == 1):
            print('|      Sun      |')
        elif (i == 2):
            print('|      Mon      |')
        elif (i == 3):
            print('|      Tue      |')
        elif (i == 4):
            print('|      Wed      |')
        else:
            print('|      Thu      |')
        for j in range(len(schedule[i])):
            print("Slot", j)
            print("________________________________________")
            for k in range(len(schedule[i][j])):
                for z in range(len(schedule[i][j][k])):
                    if (schedule[i][j][k][z] == 1):
                        if (k == 0):
                            print("|", "Tutorial Group", z,
                                  "is Taking:", "MATH101", "|")
                        elif (k == 1):
                            print("|", "Tutorial Group", z,
                                  "is Taking:", "PHYS101", "|")
                        elif (k == 2):
                            print("|", "Tutorial Group", z,
                                  "is Taking:", "CSEN101", "|")
                        elif (k == 3):
                            print("|", "Tutorial Group", z,
                                  "is Taking:", "CHEM101", "|")
                        else:
                            print("|", "Tutorial Group", z,
                                  "is Taking:", "GERM101", "|")
            print("________________________________________")
        print('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')

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

    print("Number of Tutorials for each course and Group:", tutNoForEachCourseGroup)
    print("First day and slot for each course:", firstDayForCourseTutorial)
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

    # Each tutorialGroup is assigned to exactly one TA in .
    for day in all_days:
        for slot in all_slots:
            for course in all_courses:
                for tutorialGroup in all_tutorialGroups:
                    constraints = []
                    for ta in all_tas:
                        constraints.append(
                            tutorials[(ta, day, slot, course, tutorialGroup)])
                    model.Add(sum(constraints) <= 1)

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
    # TA should have 2 days off in a week depending on highest applicable pereferance
    for ta in all_tas:
        for day in all_days:
            for slot in all_slots:
                for course in all_courses:
                    for tutorialGroup in all_tutorialGroups:
                        model.Add(tutorials[(ta, day, slot, course, tutorialGroup)] <=
                                  taOffPreference[ta][day][slot]).OnlyEnforceIf(tutorials[(ta, day, slot, course, tutorialGroup)])
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

    # pylint: disable=g-complex-comprehension
    model.Maximize(sum(tutorials[(ta, day, slot, course, tutorialGroup)]
                   for day in all_days for ta in all_tas for slot in all_slots for course in all_courses for tutorialGroup in all_tutorialGroups))

    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    counter = 0
    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        print('Solution:')
        print("-------------------------------------------start--------------------------------------------")

        for day in all_days:
            print('Day', day, '________________________________')
            for slot in all_slots:
                print(' Slot', slot)
                print()
                for course in all_courses:
                    for tutorialGroup in all_tutorialGroups:
                        tutorialNotAssigned = True
                        for ta in all_tas:
                            if solver.Value(tutorials[(ta, day, slot, course, tutorialGroup)]) == 1:
                                print('     TA:', ta, 'Assigned-to Slot:',
                                      slot, 'Course:', course, 'tutorialGroup:', tutorialGroup)
                                counter += 1
                                tutorialNotAssigned = False

                        if tutorialNotAssigned and schedule[day][slot][course][tutorialGroup] == 1:
                            print('     No TA could be assigned to this tutorial')

                print()
    else:
        print('No solution found !')
    if counter == 0:
        print('No TA assigned to any course')

    counter2 = 0
    scheduleCopy = schedule.copy()
    for i in range(len(scheduleCopy)):
        for j in range(len(scheduleCopy[i])):
            for k in range(len(scheduleCopy[i][j])):
                for x in range(len(scheduleCopy[i][j][k])):
                    if scheduleCopy[i][j][k][x] == 1:
                        counter2 += 1
    print('-------------------------------------------')
    print("courses that should be assigned:", counter2)
    print("Courses actully assigned:", counter)
    print('-------------------------------------------')

    # Statistics.
    print('\nStatistics')
    print('  - conflicts: %i' % solver.NumConflicts())
    print('  - branches : %i' % solver.NumBranches())
    print('  - wall time: %f slot' % solver.WallTime())
    print("-------------------------------------------end-----------------------------------------")


if __name__ == '__main__':
    main()
