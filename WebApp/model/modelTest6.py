"""Nurse scheduling problem with shift requests."""
from ortools.sat.python import cp_model
# IN THIS MODEL WE ACCOMPLISH THE FOLLOWING:
# TAS CAN TEACH A CERTAIN NUMBER OF SESSIONS FOR EACH COURSE


def main():
    # This program tries to find an optimal assignment of nurses to shifts
    # (3 shifts per day, for 7 days), subject to some constraints (see below).
    # Each nurse can request to be assigned to specific shifts.
    # The optimal assignment maximizes the number of fulfilled shift requests.

    # (5 Slots per day, 3 courses and we have 5 TAs)
    num_tas = 5
    num_days = 6
    num_slots = 5
    num_courses = 3
    all_tas = range(num_tas)
    all_days = range(num_days)
    all_slots = range(num_slots)
    all_courses = range(num_courses)

    # This is the assignment matrix which tells us which TA is assigned to which course AND the number of sessions he should teach
   # row : TA, col : Course
    assignment = [
        [9, 6, 0],
        [3, 6, 0],
        [3, 0, 12],
        [9, 0, 0],
        [6, 0, 6]
    ]
    # This is the tutorial group matrix which tells us which group is taking which course
    # row : courses, col : groups
    tutorialGroups = [
        [1, 1, 0, 0, 1],
        [1, 0, 1, 1, 1],
        [1, 1, 1, 1, 0]
    ]

    # Courses are either available in a slot or not based on the schedule
    # In this particular day, Course 1 is available in slot 2,3,4 but not in slots 1 and 5
    # and course 2 is available in slot 1,2 but not in slot 3,4,5 and so on
    # you can read this 3d matrix as a table with 6 rows and 5 columns containing an array of classes assigned to that slot in each tuple
    # Assume we have 4 tutorial groups
    schedule = [
        # sat
        [[[-1], [30], [40]],
         [[30, 40], [20], [10]],
         [[10], [-1], [-1]],
         [[20], [-1], [40]],
         [[-1], [-1], [-1]]
         ],
        # sun
        [[[-1], [30], [40]],
         [-1, [20], [10]],
         [[10], [-1], [-1]],
         [[20], [-1], [40]],
         [[-1], [-1], [-1]]
         ],
        # mon
        [[[-1], [30], [40]],
         [[30, 40], [20], [10]],
         [[10], [-1], [-1]],
         [[20], [-1], [40]],
         [[-1], [-1], [-1]]
         ],
        # tue
        [[[-1], [30], [40]],
         [[30, 40], [20], [10]],
         [[10], [-1], [-1]],
         [[20], [-1], [40]],
         [[-1], [-1], [-1]]
         ],
        # wed
        [[[-1], [30], [40]],
         [[30, 40], [20], [10]],
         [[10], [-1], [-1]],
         [[20], [-1], [40]],
         [[-1], [-1], [-1]]
         ],
        # thu
        [[[-1], [30], [40]],
         [[30, 40], [20], [10]],
         [[10], [-1], [-1]],
         [[20], [-1], [40]],
         [[30][10], [20]]
         ]

    ]

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
                    tutorials[(ta, day, slot, course)] = model.NewBoolVar(
                        'ta%id%is%ic%i' % (ta, day, slot, course))

    # Each tutorial is assigned to exactly one TA in .
    for day in all_days:
        for slot in all_slots:
            for course in all_courses:
                constraints = []
                for ta in all_tas:
                    constraints.append(tutorials[(ta, day, slot, course)])
                model.Add(sum(constraints) <= 1)

    # Each TA is assigned at most one tutorial in one slot.
    for day in all_days:
        for ta in all_tas:
            for slot in all_slots:
                constraints = []
                for course in all_courses:
                    constraints.append(tutorials[(ta, day, slot, course)])
                model.Add(sum(constraints) <= 1)

    # Each TA can teach a certain number of sessions for every course as indicated by the assignment matrix
    for ta in all_tas:
        for course in all_courses:
            sessionConstraints = []
            for day in all_days:
                for slot in all_slots:
                    sessionConstraints.append(
                        tutorials[(ta, day, slot, course)])
            model.Add(sum(sessionConstraints) <= assignment[ta][course])

    # TA can only be assigned to a course if he is teaching that course
    TACourseMisMatch = []
    for day in all_days:
        for ta in all_tas:
            for course in all_courses:
                if (assignment[ta][course] > 0):
                    continue
                for slot in all_slots:
                    TACourseMisMatch.append(tutorials[(ta, day, slot, course)])
    model.Add(sum(TACourseMisMatch) == 0)

    # TA can only be assigned to a course in a slot if the course is available in that slot
    SlotCourseMisMatch = []
    for day in all_days:
        for slot in all_slots:
            for course in all_courses:
                if (schedule[day][slot][course] > 0):
                    continue
                for ta in all_tas:
                    SlotCourseMisMatch.append(
                        tutorials[(ta, day, slot, course)])
    model.Add(sum(SlotCourseMisMatch) == 0)

    # pylint: disable=g-complex-comprehension
    model.Maximize(sum(tutorials[(ta, day, slot, course)]
                   for day in all_days for ta in all_tas for slot in all_slots for course in all_courses))

    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        print('Solution:')
        print("-------------------------------------------start--------------------------------------------")
        counter = 0
        for day in all_days:
            print('Day', day, '________________________________')
            for slot in all_slots:
                print(' Slot', slot)
                print()
                for course in all_courses:
                    courseNotAssigned = True
                    for ta in all_tas:
                        if solver.Value(tutorials[(ta, day, slot, course)]) == 1:
                            print('     TA:', ta, 'Assigned-to Slot:',
                                  slot, 'Course:', course)
                            counter += 1
                            courseNotAssigned = False

                    if courseNotAssigned and schedule[day][slot][course] == 1:
                        print('     No TA could be assigned to this tutorial')

                print()
    else:
        print('No solution found !')
    if counter == 0:
        print('No TA assigned to any course')

    counter2 = 0
    scheduleCopy = schedule.copy()
    for i in scheduleCopy:
        for j in i:
            for k in j:
                if (k > 0):
                    k = k - 1
                    counter2 = counter2 + 1
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
