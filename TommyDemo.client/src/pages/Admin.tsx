import { useEffect, useState } from "react";
import type { Item } from "../types/Item";
import React from "react";
import "./Admin.css";

const Admin = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [newItemName, setNewItemName] = useState("");
    const [newItemDescription, setNewItemDescription] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [addError, setAddError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

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
            setItems(items.filter(item => item.id !== id));
            setDeleteError("");
            setSuccessMessage(`"${name}" deleted successfully`);
            setTimeout(() => setSuccessMessage(""), 3000);
        } else {
            setDeleteError("Failed to delete item");
            setSuccessMessage("");
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
            setAddError("");
            const newItem = await response.json();
            setItems(prevItems => [...prevItems, newItem]);
            setSuccessMessage(`"${name}" added successfully`);
            setNewItemName("");
            setNewItemDescription("");
            setTimeout(() => setSuccessMessage(""), 3000);
        } else {
            setAddError("Failed to add item");
            setSuccessMessage("");
        }
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Manage your items</p>
            </header>

            {/* Add Item Card */}
            <div className="card add-item-card">
                <h2>Add New Item</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleAddItem(newItemName, newItemDescription);
                }}>
                    <div className="form-group">
                        <label htmlFor="itemName">Item Name</label>
                        <input
                            id="itemName"
                            type="text"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder="Enter item name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="itemDescription">Description</label>
                        <input
                            id="itemDescription"
                            type="text"
                            value={newItemDescription}
                            onChange={(e) => setNewItemDescription(e.target.value)}
                            placeholder="Enter description"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Add Item
                    </button>
                </form>
            </div>

            {/* Items Table Card */}
            <div className="card items-card">
                <h2>Items ({items.length})</h2>
                
                {successMessage && (
                    <div className="alert alert-success">{successMessage}</div>
                )}
                {addError && (
                    <div className="alert alert-error">{addError}</div>
                )}
                {deleteError && (
                    <div className="alert alert-error">{deleteError}</div>
                )}

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="empty-state">
                                        No items yet. Add one above!
                                    </td>
                                </tr>
                            ) : (
                                items.map(item => (
                                    <tr key={item.id}>
                                        <td className="item-name">{item.name}</td>
                                        <td className="item-description">{item.description}</td>
                                        <td>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(item.id, item.name)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Admin;
