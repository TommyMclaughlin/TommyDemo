import { useEffect, useState } from "react";
import type { Item } from "../types/Item";
import React from "react";

const Dashboard = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [newItemName, setNewItemName] = useState("");
    const [newItemDescription, setNewItemDescription] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [addError, setAddError] = useState("");

    useEffect(() => {
        const fetchItems = async () => {
            const response = await fetch("api/item/getAllItems", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            const data: Item[] = await response.json();
            setItems(data);
        };

        fetchItems();
    }, []);

    // Function to delete an item by ID
    const handleDelete = async (id: number, name: string) => {
        const confirmed = window.confirm(`Are you sure you want to delete "${name}"?`);
        if (!confirmed) return;

        const response = await fetch(`api/item/adminDeleteItem/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        if (response.ok) {
            // Remove deleted item from state so table updates immediately
            setItems(items.filter(item => item.id !== id));
        } else {
            setDeleteError("Failed to delete item");
        }
    };

    const handleAddItem = async (name: string, description: string) => {
        if (!name.trim()) {
            setAddError("Name is required!");
            return;
        }
        if (!description.trim()) {
            setAddError("Description is required!");
            return;
        }

        const response = await fetch('api/item/addItem/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ name, description })
        });

        if (response.ok) {
            setAddError("")
            const newItem = await response.json();

            setItems(prevItems => [...prevItems, newItem]);
        } else {
            setAddError("Failed to add item")
        }
    };



    return (
        <div>
            {addError && <p>{addError}</p>}
            <form onSubmit={(e) => {
                e.preventDefault();
                handleAddItem(newItemName, newItemDescription);
                setNewItemName("");
                setNewItemDescription("");
            }}>
                <label>Item Name</label>
                <input value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
                <label>Description</label>
                <input value={newItemDescription} onChange={(e) => setNewItemDescription(e.target.value)} />
                <button type="submit">Submit</button>
            </form>
            <h2>My Items</h2>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>

                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>
                                <button
                                    onClick={() => handleDelete(item.id, item.name)}                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {deleteError && <p>{deleteError}</p>}
        </div>
    );
};

export default Dashboard;