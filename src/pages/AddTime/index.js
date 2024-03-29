import React, {useEffect, useRef, useState} from "react";
import PageHOC from "../../components/HOC";
import './addTime.css'
import {useDispatch, useSelector} from "react-redux";
import {addTask} from "../../redux/userTasks/tasks.action";
import {NavLink} from "react-router-dom";
import {userLogOut} from "../../redux/userData/userData.actions";
import moment from "moment";
import SubmitTask from "./SubmitTask";

function AddTime() {

    const dispatch = useDispatch();
    const userLoginInfo = useSelector(state => state.userData.userLoginInfo)

    const [currentTime, setCurrentTime] = useState('')
    const [currentDay, setCurrentDay] = useState('')
    const [timeInfo, setTimeInfo] = useState({remote: 'no', description: ''})
    const [tasks, setTasks] = useState([])
    const [checkShortTime, setCheckShortTime] = useState(false)
    const [checkEntryTime, setCheckEntryTime] = useState(true)
    const [checkAddTask, setCheckAddTask] = useState(false)


    useEffect(() => {
        Time()
    })

    const unMounted = useRef(false);
    useEffect(() => {
        return () => {
            unMounted.current = true;
        };
    }, []);

    function Time() {
        let days = ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنج شنبه', 'جمعه', 'شنبه'];

        const updateTime = () => {
            let today = new Date();
            let h = today.getHours();
            let m = today.getMinutes();
            let s = today.getSeconds();
            if (s < 10) {
                s = '0' + s;
            }
            if (m < 10) {
                m = '0' + m;
            }
            if (h < 10) {
                h = '0' + h;
            }
            let time = h + ":" + m + ':' + s;
            if (!unMounted.current) {
                setCurrentTime(time)
                let dayName = days[today.getDay()];
                setCurrentDay(dayName)
            }
        }
        setInterval(updateTime, 1000)
    }

    function handleItems(event, eventType, timeType) {
        // eslint-disable-next-line default-case
        switch (eventType) {
            case 'remotely':
                let remote
                if (event.target.checked) remote = 'yes'
                else remote = 'no'
                return setTimeInfo({
                    ...timeInfo,
                    remote: remote
                })

            case 'description':
                return setTimeInfo({
                    ...timeInfo,
                    description: event.target.value
                })

            case 'start':
                if (timeType === 'hour') {
                    return setTimeInfo({
                        ...timeInfo,
                        startTime: {
                            ...timeInfo.startTime,
                            hour: event
                        }

                    })
                } else if (timeType === 'minute') {
                    return setTimeInfo({
                        ...timeInfo,
                        startTime: {
                            ...timeInfo.startTime,
                            minute: event
                        }

                    })
                }
                break

            case 'end':
                if (timeType === 'hour') {
                    return setTimeInfo({
                        ...timeInfo,
                        endTime: {
                            ...timeInfo.endTime,
                            hour: event
                        }

                    })
                } else if (timeType === 'minute') {
                    return setTimeInfo({
                        ...timeInfo,
                        endTime: {
                            ...timeInfo.endTime,
                            minute: event
                        }
                    })
                }
                break
        }

    }

    function emptyInput() {
        Array.from(document.querySelectorAll("textarea")).forEach(
            (textarea) => (textarea.value = "")
        );
        Array.from(document.querySelectorAll("select")).forEach(
            (select) => (select.selectedIndex = 0)
        );
        document.getElementById('remote').checked = false;
    }

    function addTime(event) {
        event.preventDefault();
        if (timeInfo.startTime && timeInfo.endTime) {
            const a = moment.duration(timeInfo.startTime.hour + ':' + timeInfo.startTime.minute);
            const b = moment.duration(timeInfo.endTime.hour + ':' + timeInfo.endTime.minute)
            const computedT = b.subtract(a)

            if (computedT < 600000) {
                setCheckShortTime(true)
                Array.from(document.querySelectorAll("select")).forEach(
                    (select) => (select.selectedIndex = 0)
                );
            } else {
                setCheckShortTime(false)
                setCheckEntryTime(true)
                let task = {
                    ...timeInfo,
                    userName: userLoginInfo.name,
                    userTel: userLoginInfo.tel
                }
                let value = tasks.concat(task)
                setTasks(value)
                dispatch(addTask(task))
                setCheckAddTask(true)
                emptyInput()
                setTimeInfo({remote: 'no', description: ''})
            }
        } else {
            setCheckEntryTime(false)
            setCheckAddTask(false)
        }
    }

    function logOut() {
        dispatch(userLogOut())
    }

    return (
        <PageHOC>
            <div className="add-time">
                <div className="contents col-md-8">
                    <div className="card output">
                        <p><b>Local Time: </b>{currentTime}</p>
                        <p>{currentDay}</p>
                    </div>
                    {currentDay === 'جمعه' || currentDay === 'پنج شنبه' ?
                        <div className="row m-5 p-2 border time-login-panel border border-danger">
                            <div className="col-md-12 ">
                                <p className="row justify-content-center m-3 ">Sorry, today is a holiday.</p>
                            </div>
                        </div>
                        :
                        userLoginInfo.length === 0 ?
                            <div className="row m-5 p-2 border time-login-panel">
                                <div className="col-md-12 ">
                                    <p className="row justify-content-center">you should login first </p>
                                    <NavLink className="row justify-content-center btn btn-secondary ml-3"
                                             to="/"
                                    >login</NavLink>
                                </div>
                            </div>
                            :
                            <div className="card-content" id="given">
                                <p><b className="mr-3">Hi, {userLoginInfo.name} !</b>
                                    <NavLink className="p-link" to="/login" onClick={logOut}>Do you want to
                                        logout?</NavLink>
                                </p>

                                {checkShortTime &&
                                <p className="alert-danger">Your end time is less than 10 minutes!</p>}
                                {!checkEntryTime && <p className="alert-danger">please select time!</p>}

                                <SubmitTask addTime={addTime}
                                            handleItems={(event, eventType, timeType) => handleItems(event, eventType, timeType)}
                                />
                            </div>
                    }
                </div>
            </div>
        </PageHOC>
    )
}

export default AddTime;