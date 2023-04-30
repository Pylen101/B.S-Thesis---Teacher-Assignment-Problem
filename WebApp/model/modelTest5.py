"""Nurse scheduling problem with shift requests."""
from ortools.sat.python import cp_model
# IN THIS MODEL WE EXPAND THE SCHEDULE TO INCLUDE DAYS, SLOTS AND COURSES INSTEAD OF SLOTS AND COURSES

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

    # This is the assignment matrix which tells us which TA is assigned to which course
   # row : TA, col : Course
    assignment = [
        [1, 1, 0],
        [0, 1, 0],
        [0, 0, 1],
        [1, 0, 0],
        [0, 0, 1]
    ]
    # Courses are either available in a slot or not based on the schedule
    # In this particular day, Course 1 is available in slot 2,3,4 but not in slots 1 and 5
    # and course 2 is available in slot 1,2 but not in slot 3,4,5 and so on
    # you can read this 3d matrix as a table with 6 rows and 5 columns containing an array of classes assigned to that slot in each tuple
    schedule = [
        # sat
        [[0, 1, 1],
         [1, 1, 1],
         [1, 0, 0],
         [1, 0, 1],
         [0, 0, 0]
         ],
        # sun
        [[0, 1, 1],
         [1, 1, 1],
         [1, 0, 0],
         [1, 0, 1],
         [0, 0, 0]
         ],
        # mon
        [[0, 1, 1],
         [1, 1, 1],
         [1, 0, 0],
         [1, 0, 1],
         [0, 0, 0]
         ],
        # tue
        [[0, 1, 1],
         [1, 1, 1],
         [1, 0, 0],
         [1, 0, 1],
         [0, 0, 0]
         ],
        # wed
        [[0, 1, 1],
         [1, 1, 1],
         [1, 0, 0],
         [1, 0, 1],
         [0, 0, 0]
         ],
        # thu
        [[0, 1, 1],
         [1, 1, 1],
         [1, 0, 0],
         [1, 0, 1],
         [0, 0, 0]
         ]

    ]

    # Creates the model.
    model = cp_model.CpModel()

    # Creates  variables.
    # tutorial[(ta, day, slot, course)] is an array of boolean variables, which is True
    # model.NewBoolVar('tutorial%i%id%is%ic%i' % (ta, day, slot, course)) is just creating a variable name for our problem to be printed
    tutorials = {}
    for ta in all_tas:
        for d in all_days:
            for s in all_slots:
                for course in all_courses:
                    tutorials[(ta, d, s, course)] = model.NewBoolVar(
                        'ta%id%is%ic%i' % (ta, d, s, course))

    # Each tutorial is assigned to exactly one TA in .

    for d in all_days:
        for slot in all_slots:
            for course in all_courses:
                constraints = []
                for ta in all_tas:
                    constraints.append(tutorials[(ta, d, slot, course)])
                model.Add(sum(constraints) <= 1)
    # Each TA is assigned at most one tutorial in one slot.
    for d in all_days:
        for ta in all_tas:
            for slot in all_slots:
                constraints = []
                for course in all_courses:
                    constraints.append(tutorials[(ta, d, slot, course)])
                model.Add(sum(constraints) <= 1)

    # TA can only be assigned to a course if he is teaching that course
    TACourseMisMatch = []
    for d in all_days:
        for ta in all_tas:
            for course in all_courses:
                if (assignment[ta][course] == 1):
                    continue
                for slot in all_slots:
                    TACourseMisMatch.append(tutorials[(ta, d, slot, course)])
    model.Add(sum(TACourseMisMatch) == 0)

    # TA can only be assigned to a course in a slot if the course is available in that slot
    SlotCourseMisMatch = []
    for d in all_days:
        for slot in all_slots:
            for course in all_courses:
                if (schedule[d][slot][course] == 1):
                    continue
                for ta in all_tas:
                    SlotCourseMisMatch.append(tutorials[(ta, d, slot, course)])
    model.Add(sum(SlotCourseMisMatch) == 0)

    # pylint: disable=g-complex-comprehension
    model.Maximize(sum(tutorials[(ta, d, slot, course)]
                   for d in all_days for ta in all_tas for slot in all_slots for course in all_courses))

    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        print('Solution:')
        print("-------------------------------------------start--------------------------------------------")
        counter = 0
        for d in all_days:
            print('Day', d)
            for s in all_slots:
                print('Slot', s)
                for c in all_courses:
                    for ta in all_tas:
                        if solver.Value(tutorials[(ta, d, s, c)]) == 1:
                            print('TA:', ta, 'Assigned-to Slot:',
                                  s, 'Course:', c)
                            counter += 1
                        elif solver.Value(tutorials[(ta, d, s, c)]) == 1 and assignment[ta][c] == 1:
                            print('No TA can be assigned to this tutorial')

                print()
    else:
        print('No solution found !')
    if counter == 0:
        print('No TA assigned to any course')

    # Statistics.
    print('\nStatistics')
    print('  - conflicts: %i' % solver.NumConflicts())
    print('  - branches : %i' % solver.NumBranches())
    print('  - wall time: %f s' % solver.WallTime())
    print("-------------------------------------------end-----------------------------------------")


if __name__ == '__main__':
    main()
