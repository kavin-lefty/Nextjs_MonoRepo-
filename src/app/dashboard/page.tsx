"use client"

import { useEffect, useState } from "react";

type User = {
    strName: string
    strMobile: string
    strEmail: string
}


export default function Dashboard() {
    const [user, SetUser] = useState<User[]>([]);

    useEffect(() => {
        fetch('/api/user')
            .then((res) => res.json())
            .then((data) => {
                console.log(data, '<<< user');
                SetUser(data);
            });
    }, []);

    return (
        <div>
            <table>
                <thead>

                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                    </tr>
                </thead>
                <tbody>

                    {user?.map((u, i) => (
                        <tr key={i}>
                            <td key={i}>{u.strName}</td>
                            <td key={i}>{u.strEmail}</td>
                            <td key={i}>{u.strMobile}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
}
