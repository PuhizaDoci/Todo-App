import React, {useState} from 'react';
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBModal,
    MDBModalBody,
    MDBModalHeader
} from "mdbreact";
import Datetime from 'react-datetime';
import './Task.css'

const TaskCard = ({task = {}, removeTask, addTask, checkTask}) => {
    const [currentTask, setTask] = useState(task);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [modal, setModal] = useState(false);

    function handleRemoveTask(e) {
        e.preventDefault();
        removeTask(currentTask.todoid);
    }

    function handleRemoveSubTask(e) {
        e.preventDefault();
        let updatedTask = Object.assign({}, currentTask);
        updatedTask.subtask = {};
        setTask(updatedTask)
        addTask(updatedTask)
        setModal(false)
    }

    function changeTitle(e, isSubtask = false) {
        e.preventDefault();

        let updatedTask = Object.assign({}, currentTask);
        if (isSubtask) {
            if (!updatedTask?.subtask?.title) {
                updatedTask.subtask = {
                    title: updatedTask?.subtask?.title,
                    description: updatedTask?.subtask?.title,
                    done: updatedTask?.subtask?.done
                };
            }
            updatedTask.subtask.title = e.target.value;
        } else {
            updatedTask.title = e.target.value;
        }

        console.log(updatedTask)

        setTask(updatedTask)
    }

    function changeDescription(e, isSubtask = false) {
        e.preventDefault();

        let updatedTask = Object.assign({}, currentTask);
        if (isSubtask) {
            if (!updatedTask?.subtask?.description) {
                updatedTask.subtask = {
                    title: updatedTask?.subtask?.title,
                    description: updatedTask?.subtask?.title,
                    done: updatedTask?.subtask?.done ?? false
                };
            }
            updatedTask.subtask.description = e.target.value;
        } else {
            updatedTask.description = e.target.value;
        }

        setTask(updatedTask)
    }

    function changeDueDate(value) {
        let updatedTask = Object.assign({}, currentTask);
        updatedTask.dueDate = value.toString();
        setTask(updatedTask)
    }

    function handleCheckTask(e) {
        e.preventDefault();
        checkTask(currentTask.todoid, !currentTask.done);
    }

    function handleCheckSubTask(e) {
        e.preventDefault();
        let updatedTask = Object.assign({}, currentTask);
        updatedTask.subtask.done = !updatedTask.subtask.done;
        setTask(updatedTask)
        addTask(updatedTask)
    }

    function addSubtask(e) {
        e.preventDefault();
        addTask(currentTask);
        setModal(false);
    }

    const inputProps = {
        placeholder: 'Due Date',
        disabled: currentTask.done,
    };

    return (
        <>
            <MDBCard className="m-3"
                     style={{
                         minWidth: "17rem",
                         backgroundColor: currentTask.color
                     }}
                     key={currentTask.todoid}
            >
                <MDBCardBody className={currentTask.done ? "item-card-body done p-2" : "item-card-body p-2"}>
                    <MDBContainer style={{maxHeight: "6rem"}}
                                  className="m-1">
                        <MDBInput
                            size="sm"
                            label="Task title"
                            onChange={changeTitle}
                            value={currentTask.title ?? ''}
                            className={currentTask.done ? 'task-done' : ''}
                            disabled={currentTask.done}
                        />
                    </MDBContainer>

                    <MDBContainer>
                        <MDBInput
                            type="textarea"
                            rows="3"
                            label="Description"
                            value={currentTask.description ?? ''}
                            onChange={changeDescription}
                            disabled={currentTask.done}
                            className={currentTask.done ? 'description task-done' : 'description'}
                        />
                    </MDBContainer>

                    <MDBContainer className={'mb-2 d-flex align-items-center'}>
                        <MDBIcon
                            far icon="calendar-alt"
                            size={'lg'}
                            className={'mr-2 text-warning'}
                            onClick={() => !currentTask.done && setCalendarOpen(!calendarOpen)}
                        />
                        <Datetime
                            input={true}
                            inputProps={inputProps}
                            open={calendarOpen}
                            onChange={(value) => changeDueDate(value)}
                            value={currentTask.dueDate ? Date.parse(currentTask.dueDate) : ''}
                            disabled={currentTask.done}
                        />
                    </MDBContainer>

                    <MDBContainer className={'pl-1'}>
                        <MDBBtn
                            size="sm"
                            color={"warning"}
                            onClick={() => setModal(!modal)}
                            className={'update-button'}
                            disabled={currentTask.done}
                        >
                            Subtask
                        </MDBBtn>
                        <span className={'ml-1'}>{currentTask.subtask?.title}</span>
                    </MDBContainer>

                    <MDBContainer
                        className={'d-flex align-items-center justify-content-between p-0 m-0'}
                    >
                        <MDBIcon
                            far
                            icon="trash-alt"
                            className={'text-danger delete-button'}
                            onClick={handleRemoveTask}
                        />

                        {
                            currentTask.userid &&
                            <div className={'m-0 p-0 align-items-center mt-2'}>
                                <MDBIcon
                                    far
                                    id="checkbox"
                                    icon={currentTask.done ? "check-square" : "square"}
                                    className={'text-info checkbox-icon mr-1'}
                                    onClick={handleCheckTask}
                                />
                                <label className="text-dark ml-1 mb-1" htmlFor="checkbox">
                                    Done
                                </label>
                            </div>
                        }

                        <MDBBtn
                            size="sm"
                            color={currentTask.userid ? "info" : "success"}
                            onClick={() => addTask(currentTask)}
                            className={'update-button'}
                        >
                            {
                                currentTask.userid ? "UPDATE" : "SAVE"
                            }
                        </MDBBtn>
                    </MDBContainer>
                </MDBCardBody>
            </MDBCard>

            <MDBModal isOpen={modal} toggle={() => setModal(!modal)} centered
            >
                <MDBContainer
                    className={currentTask.subtask?.done ? "done m-0 p-0" : "m-0 p-0"}>
                    <MDBModalHeader toggle={() => setModal(!modal)}>Add Task Subtask</MDBModalHeader>
                    <MDBModalBody className={'pt-1'}>
                        <MDBContainer style={{maxHeight: "4rem"}}>
                            <MDBInput
                                size="sm"
                                label=" Task title"
                                onChange={(e) => changeTitle(e, true)}
                                value={currentTask.subtask?.title ?? ''}
                            />
                        </MDBContainer>

                        <MDBContainer>
                            <MDBInput
                                type="textarea"
                                rows="2"
                                label="Description"
                                value={currentTask.subtask?.description ?? ''}
                                onChange={(e) => changeDescription(e, true)}
                            />
                        </MDBContainer>

                        <MDBContainer className={'d-flex justify-content-between m-0 p-0'}>
                            <MDBContainer className={'d-flex col-6 m-0 p-0 align-items-center'}>
                                <MDBIcon
                                    far
                                    icon="trash-alt"
                                    className={'text-danger delete-button'}
                                    onClick={handleRemoveSubTask}
                                />

                                {
                                    currentTask.userid &&
                                    <div className={'m-0 p-0 align-items-center mt-2'}>
                                        <MDBIcon
                                            far
                                            id="checkbox1"
                                            icon={currentTask.subtask?.done ? "check-square" : "square"}
                                            className={'text-info checkbox-icon mr-1'}
                                            onClick={handleCheckSubTask}
                                        />
                                        <label className="text-dark ml-1 mb-1" htmlFor="checkbox1">
                                            Done
                                        </label>
                                    </div>
                                }
                            </MDBContainer>

                            <MDBContainer className={'col-6 m-0 p-0'}>
                                <MDBBtn color="danger" size={'sm'} onClick={() => setModal(!modal)}>Close</MDBBtn>
                                <MDBBtn color="success" size={'sm'} onClick={addSubtask}>Add Subtask</MDBBtn>
                            </MDBContainer>
                        </MDBContainer>
                    </MDBModalBody>
                </MDBContainer>
            </MDBModal>
        </>
    );
}

export default TaskCard;