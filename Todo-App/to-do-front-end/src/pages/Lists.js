import React from 'react';
import {MDBBtn, MDBCard, MDBCol, MDBContainer, MDBIcon, MDBListGroup, MDBListGroupItem, MDBRow} from 'mdbreact';
import TaskList from '../components/TaskList';
import {toast, ToastContainer} from "react-toastify";
import httpClient from "../axios-config";
import './HomePage.css';
import './Lists.css';
import {Multiselect} from "multiselect-react-dropdown";

class ListsPage extends React.Component {
    state = {
        lists: [],
        unCompletedLists: [],
        userId: -1,
        loading: false,
        tasks: [],
        taskListOptions: [],
    };

    componentDidMount() {
        const userId = localStorage.getItem('id');
        this.setState({
            ...this.state,
            userId: userId
        }, () => this.getLists());
    }

    getLists = () => {
        toast.info("Loading lists...");

        const {userId} = this.state;
        httpClient.get(`read/list/${userId}`)
            .then((response) => {
                if (response.status >= 200 && response.status < 400) {
                    this.setState({
                        ...this.state,
                        lists: response.data
                    }, () => this.getTasks());

                    toast.success("Lists loaded successfully");
                }
            })
            .catch((error) => {
                console.error(error)
                toast.error('There was an error loading Lists')
            });
    }

    getTasks = () => {
        const {userId, lists} = this.state;

        httpClient.get(`read/todo/${userId}`)
            .then((response) => {
                if (response.status >= 200 && response.status < 400) {
                    const taskListOptions = response.data?.map(e => {
                        return {
                            id: e.todoid.toString(),
                            name: e.title
                        }
                    });

                    lists.forEach(list => {
                        let tasks = [];
                        list.todoid.forEach(todo => {
                            const data = response.data?.filter(t => t.todoid === todo).map(e => {
                                return {
                                    id: e.todoid.toString(),
                                    name: e.title
                                }
                            });
                            if (data?.length >= 1)
                                tasks.push(data[0])
                        })

                        list.tasks = tasks;
                    });

                    this.setState({
                        ...this.state,
                        tasks: response.data,
                        taskListOptions: taskListOptions,
                        lists: lists
                    });
                }
            })
            .catch((error) => {
                console.error(error)
                toast.error('There was an error loading Todos')
            });
    }

    addTemporaryList = (e) => {
        e.preventDefault();
        let {lists, unCompletedLists} = this.state;

        if (unCompletedLists?.find(t => t.title === '' || !t.title)) {
            toast.warn("Please fill the current list first!")
            return;
        }

        const listId = lists.length >= 1 ? lists[lists.length - 1].listId + 1 : 1;

        unCompletedLists?.push({
            listId: listId,
            title: '',
            description: '',
            todoid: [1],
            userId: this.state.userId
        });

        this.setState({
            ...this.state,
            listId: listId,
            unCompletedLists: unCompletedLists,
        });
    }

    removeList = (index) => {
        const {lists, unCompletedLists} = this.state,
            listToDelete = lists.find(t => t.listId === index);

        if (listToDelete) {
            httpClient.delete(`delete/list/${listToDelete.listId}/${listToDelete.userid}`)
                .then((res) => {
                    const newLists = lists.filter(t => parseInt(t.listId) !== index);

                    this.setState({
                        ...this.state,
                        lists: newLists,
                        unCompletedLists: -1 >= lists.findIndex(t => t.listId !== index)
                            ? unCompletedLists.filter(t => t.listId !== index)
                            : []
                    });

                    toast.info("List removed successfully!")
                    
                    window.location.replace('/lists');
                })
                .catch((err) => {

                });
        } else {
            this.setState({
                ...this.state,
                unCompletedLists: -1 >= lists.findIndex(t => t.listId === index)
                    ? unCompletedLists.filter(t => t.listId !== index)
                    : []
            });

            toast.info("List removed successfully!")
        }
    }

    addList = (list) => {
        let {lists, unCompletedLists, userId} = this.state;

        if (list.title === '' || !list.title || list.description === '' || !list.description) {
            toast.warn("Please fill the current list first!")
            return;
        }

        list.userid = userId;

        httpClient.post('add/list', list)
            .then((response) => {
                if (response.status >= 200 && response.status < 400) {
                    lists.push(list)
                    unCompletedLists = unCompletedLists.filter(t => t.todoid !== list.todoid);

                    this.setState({
                        ...this.state,
                        lists: lists,
                        unCompletedLists: unCompletedLists
                    });

                    toast.success("List created successfully!")
                } else {
                    throw Error("Could not create list. Try again!")
                }
            })
            .catch((error) => {
                console.error(error)
                toast.success("There was an error creating the list. Try again!")
            });
    }

    updateList = (list) => {
        this.setState({
            ...this.state,
            loading: true
        });

        let {lists} = this.state;
        const listIndex = lists.findIndex(t => t.listId === list.listId);

        if (JSON.stringify(lists[listIndex]) === JSON.stringify(list)) {
            toast.info("List is the same, nothing to update!")
            return;
        }

        lists[listIndex].title = lists.title;
        lists[listIndex].description = lists.description;
        lists[listIndex].todoid = lists.todoid;

        this.updateListsApi(list, lists[listIndex])
            .then(response => {
                if (response.status >= 200 && response.status < 400) {
                    this.setState({
                        ...this.state,
                        lists: lists
                    });

                    toast.success("List updated successfully!")
                }
            })
            .catch((error) => {
                console.error(error)
                toast.success("There was an error updating the list. Try again!")
            })
            .finally(() => {
                this.setState({
                    ...this.state,
                    loading: false
                })
            })
    }

    updateListsApi = (list, newList) => {
        return httpClient.post(`update/list/${list.listId}`, newList);
    }

    clickItem = (id, isNewList) => {
        if (isNewList) return;

        let {lists} = this.state,
            listIndex = lists.findIndex(l => l.listId === id);
        lists[listIndex].showTasks = !lists[listIndex].showTasks ?? true;

        this.setState({
            ...this.state,
            lists: lists
        });
    }

    onSelect = (selectedList, listId) => {
        let {lists} = this.state,
            listIndex = lists.findIndex(l => l.listId === listId);

        lists[listIndex].tasks = selectedList
        lists[listIndex].todoid = selectedList?.map(e => parseInt(e.id))

        this.updateListsApi(lists[listIndex], lists[listIndex])
            .then((response) => {
                this.setState({
                    ...this.state,
                    lists: lists
                })
            })
            .catch((error) => {

            })
    }

    onRemove = (selectedList, listId) => {
        let {lists} = this.state,
            listIndex = lists.findIndex(l => l.listId === listId);

        lists[listIndex].tasks = selectedList

        this.setState({
            ...this.state,
            lists: lists
        })
    }

    render() {
        const {
                lists, unCompletedLists, taskListOptions
            } = this.state;

        return (
            <MDBContainer className="mt-3 mb-3">
                <MDBContainer className={'d-flex align-items-center justify-content-start mb-3'}>
                    <MDBContainer className={'col-8 ml-0'}>
                        <MDBBtn
                            floating
                            size="md"
                            color="success"
                            onClick={this.addTemporaryList}
                            className="white-text ml-1 mr-1"
                        >
                            <MDBIcon size="lg" icon="plus" className="mr-1"/>
                            &nbsp; New List
                        </MDBBtn>
                    </MDBContainer>
                </MDBContainer>


                <MDBListGroup style={{width: "22rem"}}>
                    {
                        unCompletedLists && unCompletedLists.length >= 1
                            ? unCompletedLists.map((list, index) =>
                                <MDBCard className={'mb-2'}
                                         key={index}>
                                    <TaskList
                                        index={index}
                                        list={list}
                                        removeList={this.removeList.bind(this)}
                                        addList={this.addList.bind(this)}
                                        clickItem={this.clickItem.bind(this)}
                                        isNewList={true}
                                    />
                                </MDBCard>
                            )
                            : <></>
                    }
                </MDBListGroup>

                {
                    lists?.length >= 1 && unCompletedLists?.length >= 1 ?
                        <MDBContainer className={'border mb-2'}/> : <></>
                }

                {
                    lists && lists.length >= 1 ?
                        <>
                            <MDBListGroup style={{width: "100%"}}>
                                {
                                    lists && lists.length >= 1
                                        ? lists.map((list, index) =>
                                            <MDBRow className={'d-flex'}
                                                    key={index}>
                                                <MDBCol col className={'col-12 col-md-5'} style={{width: "22rem"}}>
                                                    <MDBCard className={'mb-2'}>
                                                        <TaskList
                                                            index={index}
                                                            list={list}
                                                            removeList={this.removeList.bind(this)}
                                                            addList={this.updateList.bind(this)}
                                                            clickItem={this.clickItem.bind(this)}
                                                        />
                                                    </MDBCard>
                                                </MDBCol>
                                                {
                                                    list.showTasks && <MDBCol className={'col-12 col-md-7'}>
                                                        <MDBCard className={'mb-2 list-task-item'}>
                                                            <MDBListGroupItem hover
                                                                              className="m-0 p-3"
                                                                              style={{
                                                                                  minWidth: '17rem',
                                                                                  border: 0,
                                                                                  height: '100%'
                                                                              }}
                                                                              key={index}
                                                            >

                                                                <MDBContainer>
                                                                    <h6><b>Add Tasks to List</b></h6>

                                                                    <Multiselect
                                                                        options={taskListOptions}
                                                                        selectedValues={list.tasks}
                                                                        onSelect={(a, b) => this.onSelect(a, list.listId)}
                                                                        onRemove={(a, b) => this.onRemove(a, list.listId)}
                                                                        displayValue="name"
                                                                    />

                                                                    {
                                                                        list.tasks?.length >= 1 &&
                                                                        list.tasks.map((e, k) => {
                                                                            return <span key={k}
                                                                                         className={'mr-3 text-info'}
                                                                            >
                                                                                <b>{e.id}) {e.name?.toUpperCase()}</b>
                                                                            </span>
                                                                        })
                                                                    }
                                                                </MDBContainer>
                                                            </MDBListGroupItem>
                                                        </MDBCard>
                                                    </MDBCol>
                                                }
                                            </MDBRow>
                                        )
                                        : <></>
                                }
                            </MDBListGroup>
                        </>
                        : <></>
                }
                <ToastContainer/>
            </MDBContainer>
        );
    }
}

export default ListsPage;