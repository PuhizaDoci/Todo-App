import React from 'react';
import {MDBBadge, MDBBtn, MDBContainer, MDBIcon, MDBRow} from "mdbreact";
import './Tasks.css';
import TaskCard from "../components/TaskCard";
import {toast, ToastContainer} from "react-toastify";
import httpClient from "../axios-config";

const colors = ['azure', 'aliceblue', 'antiquewhite', 'beige', 'lightcyan',
    'lightgoldenrodyellow', 'blisque', 'white'];

class TasksPage extends React.Component {
    state = {
        tasks: [],
        unCompletedTasks: [],
        userId: -1,
        loading: false
    };

    componentDidMount() {
        const userId = localStorage.getItem('id');
        this.setState({
            ...this.state,
            userId: userId
        }, () => this.getTasks());
    }

    getTasks = () => {
        toast.info("Loading tasks...");

        const {userId} = this.state;
        httpClient.get(`read/todo/${userId}`)
            .then((response) => {
                if (response.status >= 200 && response.status < 400) {
                    this.setState({
                        ...this.state,
                        tasks: response.data
                    });

                    toast.success("Tasks loaded successfully");
                }
            })
            .catch((error) => {
                console.error(error)
                toast.error('There was an error loading Tasks')
            });
    }

    addTemporaryTask = (e) => {
        e.preventDefault();
        let {tasks, unCompletedTasks} = this.state;

        if (unCompletedTasks.find(t => t.title === '' || !t.title)) {
            toast.warn("Please fill the current Task first!")
            return;
        }

        const taskId = tasks.length >= 1 ? tasks[tasks.length - 1].todoid + 1 : 1;

        unCompletedTasks.push({
            todoid: taskId,
            title: '',
            description: '',
            done: false,
            color: colors[Math.floor(Math.random() * colors.length)],
            subtask: {}
        });

        this.setState({
            ...this.state,
            unCompletedTasks: unCompletedTasks
        });
    }

    addTask = (task) => {
        let {tasks, unCompletedTasks, userId} = this.state;

        if (task.title === '' || !task.title || task.description === '' || !task.description) {
            toast.warn("Please fill the current Task first!")
            return;
        }

        task.userid = userId;
        if (!task.subtask?.title) {
            task.subtask = {};
        }

        httpClient.post('add/todo', task)
            .then((response) => {
                if (response.status >= 200 && response.status < 400) {
                    tasks.push(task)
                    unCompletedTasks = unCompletedTasks.filter(t => t.todoid !== task.todoid);

                    this.setState({
                        ...this.state,
                        tasks: tasks,
                        unCompletedTasks: unCompletedTasks
                    });

                    toast.success("Task created successfully!")
                } else {
                    throw Error("Could not create task. Try again!")
                }
            })
            .catch((error) => {
                console.error(error)
                toast.success("There was an error creating the task. Try again!")
            });
    }

    updateTask = (task) => {
        this.setState({
            ...this.state,
            loading: true
        });

        let {tasks} = this.state;
        const taskIndex = tasks.findIndex(t => t.todoid === task.todoid);

        if (JSON.stringify(tasks[taskIndex]) === JSON.stringify(task)) {
            toast.info("Task is the same, nothing to update!")
            return;
        }

        tasks[taskIndex].title = task.title;
        tasks[taskIndex].description = task.description;
        tasks[taskIndex].done = task.done;
        tasks[taskIndex].subtask = task.subtask;

        this.updateTaskApi(task, tasks[taskIndex])
            .then(response => {
                if (response.status >= 200 && response.status < 400) {
                    this.setState({
                        ...this.state,
                        tasks: tasks
                    });

                    toast.success("Task updated successfully!")
                }
            })
            .catch((error) => {
                console.error(error)
                toast.success("There was an error updating the task. Try again!")
            })
            .finally(() => {
                this.setState({
                    ...this.state,
                    loading: false
                })
            })
    }

    updateTaskApi = (task, newTask) => {
        return httpClient.post(`update/todo/${task.todoid}`, newTask);
    }

    removeTask = (index) => {
        const {tasks, unCompletedTasks} = this.state,
            taskToDelete = tasks.find(t => t.todoid === index);

        if (taskToDelete) {
            httpClient.delete(`delete/todo/${taskToDelete.todoid}/${taskToDelete.userid}`)
                .then((res) => {
                    const newTasks = tasks.filter(t => parseInt(t.todoid) !== index);

                    this.setState({
                        ...this.state,
                        tasks: newTasks,
                        unCompletedTasks: -1 >= tasks.findIndex(t => t.todoid === index)
                            ? unCompletedTasks.filter(t => t.todoid !== index)
                            : []
                    });

                    toast.info("Task removed successfully!")
                    
                    window.location.replace('/tasks');
                })
                .catch((err) => {

                });
        } else {
            this.setState({
                ...this.state,
                unCompletedTasks: -1 >= tasks.findIndex(t => t.todoid === index)
                    ? unCompletedTasks.filter(t => t.todoid !== index)
                    : []
            });

            toast.info("Task removed successfully!")
        }
    }

    checkTask = (taskId, done) => {
        let {tasks, loading} = this.state,
            taskIndex = tasks.findIndex(t => t.todoid === taskId);

        if (loading) {
            toast.warn("Something is Loading, try again later!")
            return;
        }

        tasks[taskIndex].done = done;

        this.updateTaskApi(tasks[taskIndex], tasks[taskIndex])
            .then(response => {
                if (response.status >= 200 && response.status < 400) {
                    this.setState({
                        ...this.state,
                        tasks: tasks
                    });

                    toast.info(`Task marked as ${done ? "done" : "not done"}`)
                }
            })
            .catch((error) => {
                console.error(error)
                toast.success("There was an error updating the task. Try again!")
            });
    }

    render() {
        const {tasks, unCompletedTasks} = this.state,
            hasTasks = tasks?.length >= 1,
            done = tasks.filter(t => t.done === true),
            todo = tasks.filter(t => t.done === false)

        return (
            <MDBContainer className="mt-3">
                <MDBContainer className={'d-flex align-items-center justify-content-start'}>
                    <MDBContainer className={'col-8 ml-0'}>
                        <MDBBtn
                            floating
                            size="md"
                            color="success"
                            onClick={this.addTemporaryTask}
                            className="white-text ml-1 mr-1"
                        >
                            <MDBIcon size="lg" icon="plus" className="mr-1"/>
                            &nbsp; New Task
                        </MDBBtn>
                    </MDBContainer>

                    {
                        hasTasks && <MDBContainer className={'d-flex justify-content-start'}>
                            <MDBContainer className={'col-6 m-0'}>
                                <b>Todo:</b> <MDBBadge pill color="danger">{todo?.length}</MDBBadge>
                            </MDBContainer>
                            <MDBContainer className={'col-6 m-0'}>
                                <b>Done:</b> <MDBBadge pill color="warning">{done?.length}</MDBBadge>
                            </MDBContainer>
                        </MDBContainer>
                    }
                </MDBContainer>

                <MDBRow>
                    {
                        unCompletedTasks && unCompletedTasks.length >= 1
                            ? unCompletedTasks.map((task, index) =>
                                <TaskCard
                                    key={index}
                                    index={index}
                                    task={task}
                                    removeTask={this.removeTask.bind(this)}
                                    addTask={this.addTask.bind(this)}
                                />
                            )
                            : <></>
                    }
                </MDBRow>

                {
                    tasks?.length >= 1 && unCompletedTasks?.length >= 1 ?
                        <MDBContainer className={'border'}/> : <></>
                }

                {
                    tasks && tasks.length >= 1 ?
                        <>
                            <MDBContainer className={'p-0'}>
                                <MDBRow className={tasks.length >= 3 ? 'justify-content-center' : ''}>
                                    {
                                        tasks && tasks.length >= 1
                                            ? tasks.map((task, index) =>
                                                <TaskCard
                                                    key={index}
                                                    index={index}
                                                    task={task}
                                                    removeTask={this.removeTask.bind(this)}
                                                    addTask={this.updateTask.bind(this)}
                                                    checkTask={this.checkTask.bind(this)}
                                                />
                                            )
                                            : <></>
                                    }
                                </MDBRow>
                            </MDBContainer>
                        </>
                        : <></>
                }

                <ToastContainer/>
            </MDBContainer>
        );
    }
}

export default TasksPage;