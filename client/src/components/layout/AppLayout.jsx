import { Drawer, Grid, Skeleton } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { useMyChatsQuery } from "../../redux/api/api";
import { setIsDeleteMenu, setIsMobileMenu, setSelectedDeleteChat } from "../../redux/reducers/misc";
import Footer from "../shared/Footer";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import Header from "./Header";
import { getSocket } from "../../socket";
import { incrementNotification, setNewMessagesAlert } from "../../redux/reducers/chat";
import { getOrSaveFromStorage } from "../../lib/features";
import { ONLINE_USERS, REFETCH_CHATS, NEW_REQUEST, NEW_MESSAGE_ALERT } from "../../constants/events";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";

const AppLayout = () => (WrappedComponent) => {
    return (props) => {
        const params = useParams();
        const navigate = useNavigate();
        const dispatch = useDispatch();
        const socket = getSocket();
        const chatId = params.chatId;
        const deleteMenuAnchor = useRef(null);

        const [onlineUsers, setOnlineUsers] = useState([]);
        const { isMobileMenu } = useSelector((state) => state.misc);
        const { user } = useSelector((state) => state.auth);
        const { newMessagesAlert } = useSelector((state) => state.chat);
        const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");
        useErrors([{ isError, error }]);

        useEffect(() => {
            getOrSaveFromStorage({key:'NEW_MESSAGES_ALERT', value: newMessagesAlert});
        }, [newMessagesAlert]);

        const handleDeleteChat = (e, chatId, groupChat) => {
            dispatch(setIsDeleteMenu(true));
            dispatch(setSelectedDeleteChat({ chatId, groupChat }));
            deleteMenuAnchor.current = e.currentTarget;
        }
        const handleMobileClose = () => dispatch(setIsMobileMenu(false));


        const newMessagesAlertListener = useCallback((data)=>{
            if(data.chatId === chatId) return;
            dispatch(setNewMessagesAlert(data));
        }, [chatId]);
        
        const newRequestListener = useCallback(()=>{
            dispatch(incrementNotification());
        }, [dispatch]);

        const refetchListener = useCallback(()=>{
            refetch();
            navigate("/");
        }, [refetch, navigate]);

        const onlineUsersListener = useCallback((data)=>{
            setOnlineUsers(data);
        }, []);

        const eventHandlers = {
            [NEW_MESSAGE_ALERT]: newMessagesAlertListener,
            [NEW_REQUEST]: newRequestListener,
            [REFETCH_CHATS]: refetchListener,
            [ONLINE_USERS]: onlineUsersListener,
        };

        useSocketEvents(socket, eventHandlers);
        return (
            <div>
                {/* <Title /> */}
                <Header />
                <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor}/>
                {
                    isLoading ? <Skeleton /> : (
                        <Drawer open={isMobileMenu} onClose={handleMobileClose}>
                            <ChatList
                                w='70vw'
                                chats={data?.chats}
                                chatId={chatId}
                                handleDeleteChat={handleDeleteChat}
                                newMessagesAlert={newMessagesAlert}
                                onlineUsers={onlineUsers}
                            />
                        </Drawer>
                    )
                }
                <Grid container height={"calc(100vh - 4rem)"}>
                    <Grid item sm={4} md={3} sx={{
                        display: { xs: "none", sm: "block" },

                    }} height={"100%"}>
                        {isLoading ?
                            (<Skeleton />) : (
                                <ChatList
                                    chats={data?.chats}
                                    chatId={chatId}
                                    handleDeleteChat={handleDeleteChat}
                                    newMessagesAlert={newMessagesAlert}
                                    onlineUsers={onlineUsers}
                                />
                            )
                        }
                    </Grid>
                    <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
                        <WrappedComponent {...props} chatId={chatId} user={user} />
                    </Grid>
                    <Grid item md={4} lg={3} height={"100%"} sx={{
                        display: { xs: "none", md: "block" },
                        padding: "2rem",
                        bgcolor: "rgba(0, 0, 0, 0.85)"
                    }}>
                        <Profile user={user} />
                    </Grid>
                </Grid>
                <Footer />
            </div>
        )
    };
};

export default AppLayout;