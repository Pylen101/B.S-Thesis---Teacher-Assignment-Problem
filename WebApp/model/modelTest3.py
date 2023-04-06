"""Nurse scheduling problem with shift requests."""
from ortools.sat.python import cp_model


def main():
    # This program tries to find an optimal assignment of nurses to shifts
    # (3 shifts per day, for 7 days), subject to some constraints (see below).
    # Each nurse can request to be assigned to specific shifts.
    # The optimal assignment maximizes the number of fulfilled shift requests.

    # (5 Slots per day, 3 courses and we have 5 TAs)
    num_tas = 5
    num_courses = 3
    num_slots = 5
    all_tas = range(num_tas)
    all_courses = range(num_courses)
    all_slots = range(num_slots)
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
    # row : Slot, col : Course
    schedule = [[0, 1, 1],
                [1, 1, 1],
                [1, 0, 0],
                [1, 0, 1],
                [0, 0, 0]]

    # Creates the model.
    model = cp_model.CpModel()

    # Creates  variables.
    # shifts[(n, d, s)]: nurse 'n' works shift 's' on day 'd'.
    tutorials = {}
    for t in all_tas:
        for s in all_slots:
            for course in all_courses:
                tutorials[(t, s, course)] = model.NewBoolVar(
                    'ta%is%ic%i' % (t, s, course))

    # Each tutorial is assigned to exactly one nurse in .

    for slot in all_slots:
        for course in all_courses:
            constraints = []
            for ta in all_tas:
                constraints.append(tutorials[(ta, slot, course)])
            model.AddExactlyOne(constraints)
            # model.AddExactlyOne(tutorials[(ta, slot, course)]
            #                     for ta in all_tas if assignment[ta][course] == 1)

    for ta in all_tas:
        for slot in all_slots:
            constraints = []
            for course in all_courses:
                constraints.append(tutorials[(ta, slot, course)])
            model.Add(sum(constraints) <= 1)
    # pylint: disable=g-complex-comprehension

    model.Maximize(sum(tutorials[(ta, slot, course)]
                   for ta in all_tas for slot in all_slots for course in all_courses if assignment[ta][course] == 1 and schedule[slot][course] == 1))
    # Creates the solver and solve.
    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        print('Solution:')
        counter = 0
        for s in all_slots:
            print('Slot', s)
            for c in all_courses:
                for ta in all_tas:
                    if assignment[ta][c] == 1 and schedule[s][c] == 1 and solver.Value(tutorials[(ta, s, c)]) == 1:
                        print('TA', ta, 'Slot', s, 'Course', c, 'assigned')
                        counter += 1
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


if __name__ == '__main__':
    main()
