import useScheduleContext from "../hooks/useScheduleContext"
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const ScheduleDetailsTA = ({ schedule }) => {
    const { dispatchSchedule } = useScheduleContext();
    const [tutorialTableView, setTutorialTableView] = useState([])
    useEffect(() => {
        handleView()
    }, [])
    const dayCase = (day) => {
        switch (day) {
            case 0:
                return "SAT"
            case 1:
                return "SUN"
            case 2:
                return "MON"
            case 3:
                return "TUE"
            case 4:
                return "WED"
            case 5:
                return "THU"
            default:
                return "ERROR"
        }
    }
    const handleView = () => {
        if (schedule) {
            //console.log('here')
            let temp = schedule.tutorialsArray
            let tempView =
                [[[], [], [], [], []],
                [[], [], [], [], []],
                [[], [], [], [], []],
                [[], [], [], [], []],
                [[], [], [], [], []],
                [[], [], [], [], []]]
            for (let i = 0; i < temp.length; i++) {
                let tutorial = temp[i]
                //console.log(tutorial)
                tempView[tutorial.day][tutorial.slot].push(tutorial)
            }
            setTutorialTableView(tempView)
            console.log(tutorialTableView)
        }

    }

    return (

        <div className='teacherAssistantsProfileBody'>
            <div>
                <div className="displayTable">

                    <h2>Schedule ID: {"<" + schedule._id + ">"}</h2>
                    <label style={{
                        textAlign: 'center',
                        backgroundColor: '#1aac83',
                        color: 'white',
                        width: '100%',
                        border: '1px solid black'
                    }}><strong>Schedule Tutorials</strong></label>
                    <table>
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Slot 1</th>
                                <th>Slot 2</th>
                                <th>Slot 3</th>
                                <th>Slot 4</th>
                                <th>Slot 5</th>
                            </tr>
                        </thead>
                        {
                            tutorialTableView.map((day, dayIndex) => ((
                                <tr>
                                    <td>{dayCase(dayIndex)}</td>
                                    {day.map((slot, slotIndex) => (
                                        <td>
                                            {slot.map((tutorial, index3) => (
                                                <div className='tutorial-form'>
                                                    <p></p>
                                                    <label className='tutorial-form-label'>Tutorial</label>
                                                    <div>
                                                        <div style={{
                                                            transform: 'translate(5px, -5px)'
                                                        }}>
                                                            <label className='tutorial-label-output' type="text" >Course: <strong>{tutorial.courseCode}</strong></label>
                                                            <label className='tutorial-label-output' type="text" >Tutorial Grp: <strong>{tutorial.tutorialGroup}</strong></label>
                                                            <label className='tutorial-label-output' type="text" >TA: <strong>{tutorial.assignedTA}</strong></label>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </td>
                                    ))}
                                </tr>
                            )
                            ))


                        }

                    </table>
                </div>
            </div>
        </div>
    );

}

export default ScheduleDetailsTA;