from ortools.sat.python import cp_model


def main():
    # Data
    # 3 TAs, 5 Slots, 3 Courses
    # Assume assignment here means load for each TA
    # (load to be added later on)

    # Assignment of each TA to each course
    assignment = [
        [1, 1, 0],
        [0, 1, 0],
        [0, 0, 1]
    ]
    # The courses in each slot
    schedule = [
        [0, 1, 0],
        [0, 0, 1],
        [1, 0, 0],
        [0, 0, 1],
        [0, 1, 0]
    ]

    # ---------------------> Replace Workers with Teaching Assistants
    num_slots = len(schedule)
    num_courses = len(schedule[0])
    num_tas = len(assignment)

    # Model
    model = cp_model.CpModel()

    # Variables
    x = []
    for i in range(num_tas):
        t = []
        for j in range(num_courses):
            t.append(model.NewBoolVar(f'x[{i},{j}]'))
        x.append(t)

    # Constraints
    # Each worker is assigned to at most one task.
    for i in range(num_tas):
        model.AddAtMostOne(x[i][j] for j in range(num_courses))

    # Each task is assigned to exactly one worker.
    for j in range(num_courses):
        model.AddExactlyOne(x[i][j] for i in range(num_tas))

    # Objective
    # objective_terms = []
    # for i in range(num_tas):
    #    for j in range(num_courses):
    #        objective_terms.append(assignment[i][j] * x[i][j])
    # model.Minimize(sum(objective_terms))

    # Solve
    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    # Print solution.
    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        print()
        for i in range(num_tas):
            for j in range(num_courses):
                if solver.BooleanValue(x[i][j]):
                    print(
                        f'Worker {i} assigned to task {j} Cost = {assignment[i][j]}')
    else:
        print('No solution found.')


if __name__ == '__main__':
    main()
