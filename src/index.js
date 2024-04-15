import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import Project from "./Components/Project/Project"
import Layout from "./Components/Layout/Layout"
import LogIn from "./Components/LogIn/LogIn"
import LogOff from "./Components/LogOff/LogOff"

const App = () => {
    const [user, setUser] = useState({
        isAuthenticated: false,
        userName: "",
        userRole: "",
    })

    useEffect(() => {
        const getUser = async () => {
            return await fetch("api/isAuth")
                .then((response) => {
                    response.status === 401 &&
                        setUser({ isAuthenticated: false, userName: "" })
                    return response.json()
                })
                .then(
                    (data) => {
                        if (
                            typeof data !== "undefined" &&
                            typeof data.userName !== "undefined"
                        ) {
                            setUser({ isAuthenticated: true, userName: data.Name })
                        }
                    },
                    (error) => {
                        console.log(error)
                    }
                )
        }
        getUser()
    }, [setUser])

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout user={user} />}>
                    <Route index element={<h3>Главная страница</h3>} />
                    <Route
                        path="/projects"
                        element={
                                <Project user={user} />
                        }
                    />
                    <Route
                        path="/login"
                        element={<LogIn user={user} setUser={setUser} />}
                    />
                    <Route path="/logoff" element={<LogOff setUser={setUser} />} />
                    <Route path="*" element={<h3>404</h3>} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    // <React.StrictMode>
    <App />
    // </React.StrictMode>
)
