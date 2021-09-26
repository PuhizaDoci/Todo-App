import React, {useState} from 'react';
import {MDBBtn, MDBContainer, MDBIcon, MDBInput, MDBListGroupItem} from "mdbreact";
import './Task.css'

const ListItem = ({list = {}, removeList, addList, clickItem, isNewList = false}) => {
    const [currentList, setList] = useState(list);

    function handleRemoveList(e) {
        e.preventDefault();
        removeList(currentList.listId);
    }

    function changeTitle(e) {
        e.preventDefault();
        let updatedList = Object.assign({}, currentList);
        updatedList.title = e.target.value;
        setList(updatedList)
    }

    function changeDescription(e) {
        e.preventDefault();
        let updatedList = Object.assign({}, currentList);
        updatedList.description = e.target.value;
        setList(updatedList)
    }

    function handleClickItem(e) {
        e.preventDefault();
        clickItem(currentList.listId, isNewList)
    }

    const date = new Date(currentList.lastModified)?.toLocaleString()
    console.log(date)

    return (
        <MDBListGroupItem hover
                          className="m-0 p-3"
                          style={{
                              backgroundColor: currentList.color,
                              minWidth: '17rem',
                              border: 0,
                          }}
                          key={currentList.listId}
                          onClick={handleClickItem}
        >
            <MDBContainer className="d-flex w-100 justify-content-between">
                <MDBInput
                    className="mb-1"
                    size="sm"
                    label="List title"
                    value={currentList.title}
                    onChange={changeTitle}
                />
                <small className={'text-warning'}>Click to add tasks</small>
                <small>{date.toString() == "Invalid Date" ? '' : date}</small>
            </MDBContainer>
            <MDBContainer>
                <MDBInput
                    className="mb-1"
                    type="textarea"
                    rows="1"
                    label="Description"
                    value={currentList.description}
                    onChange={changeDescription}
                />
            </MDBContainer>
            <MDBContainer
                className={'d-flex align-items-center justify-content-between p-0 m-0'}
            >
                <MDBIcon
                    far
                    icon="trash-alt"
                    className={'text-danger delete-button'}
                    onClick={handleRemoveList}
                />

                <MDBBtn
                    size="sm"
                    color={currentList.userid ? "info" : "success"}
                    onClick={() => addList(currentList)}
                >
                    {
                        currentList.userid ? "UPDATE" : "SAVE"
                    }
                </MDBBtn>
            </MDBContainer>
        </MDBListGroupItem>
    );
};

export default ListItem;