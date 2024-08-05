import { Drawer, Grid, Skeleton } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useErrors } from "../../hooks/hook";
import { useMyChatsQuery } from "../../redux/api/api";
import { setIsMobileMenu } from "../../redux/reducers/misc";
import Footer from "../shared/Footer";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import Header from "./Header";
import { getSocket } from "../../socket";

const AppLayout = () => (WrappedComponent) => {
    return (props) => {
        const params = useParams();
        const chatId = params.chatId;
        const dispatch = useDispatch();
        const socket = getSocket();
        const { isMobileMenu } = useSelector((state) => state.misc);
        const { user } = useSelector((state) => state.auth);
        const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");
        useErrors([{ isError, error }]);
        const handleDeleteChat = (e, _id, groupChat) => {
            e.preventDefault();
            console.log('Delete chat', _id, groupChat);
        }
        const handleMobileClose = () => dispatch(setIsMobileMenu(false));
        return (
            <div>
                {/* <Title /> */}
                <Header />
                {
                    isLoading ? <Skeleton /> : (
                        <Drawer open={isMobileMenu} onClose={handleMobileClose}>
                            <ChatList
                                w='70vw'
                                chats={data?.chats}
                                chatId={chatId}
                                handleDeleteChat={handleDeleteChat}
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