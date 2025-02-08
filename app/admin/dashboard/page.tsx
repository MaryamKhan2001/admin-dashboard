'use client'
import ProtectedRoute from "@/app/component/ProtectedRoute";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface order{
    _id : string;
    firstName:string;
    lastName:string;
    phone: number;
    email: string;
    address: string;
    zipCode: string;
    city:string;
    total: number;
    discount:number;
    orderDate:string;
    status: string|null;
    cartItems:{
        map(arg0: (item: any) => React.JSX.Element): React.ReactNode | Iterable<React.ReactNode>;title:string ; productImage: string
}
}
export default function AdminDashBoard (){
    const [order , setOrders] = useState<order[]>([])
    const [selectedOrderId,setSelectedOrderId] = useState<string | null >(null)
    const [filter,setFilter] = useState("All")

    useEffect(()=>{
        client.fetch(
            `*[_type == "order"]{
            _id,
            firstName,
            lastName,
            phone,
            email,
            address,
            zipCode,
            total,
            discount,
            orderDate,
            status,
            city,
            cartItems[]->
            {title, productImage}
            }`
        )
        .then(data=>setOrders(data))
        .catch((error)=>console.log("error fetching products",error))
    },[])
    
    const filteredOrders = filter === "All"? order:order.filter((order)=>order.status === filter)

    const toggleOrderDetails =(orderId:string)=>{
        setSelectedOrderId((prev)=>(prev === orderId ? null :orderId))

        const handleDelete = async (orderId :string)=>{
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            })
            if(result.isConfirmed)return

            try{
                await client.delete(orderId)
                setOrders((prevorder)=>prevorder.filter((order)=>order._id!== orderId));
                Swal.fire("Delete!","your order has been deleted","success")
            }catch (error){
                Swal.fire("Error!","failed to delete order","error")
            }
        }
        const handleStatusChange = async (orderId:string , newStatus : string)=>{
            try{
                await client 
                .patch(orderId)
                .set({status: newStatus})
                .commit

                setOrders((prevOrder)=>prevOrder.map((order)=>order._id === orderId? {...order, status: newStatus}:order))
                if(newStatus === "Dispatch"){
                    Swal.fire("dispatch!","the order is now dispatched","success")
                }
                else if(newStatus === "success"){
                    Swal.fire("Success!","The order has been completed","success")
                }
            }catch (error){
                console.log("Error updating order status",error);
                Swal.fire("Error!","something went wrong while updating the status","error")
            }

        }
    //     function HandleStatus (_id : string, value:string):void{
    //         throw new Error("Function not implemented")
    //     }
    // }
    // function HandleStatus(_id: string, value: string): void {
    //     throw new Error("Function not implemented.");
    // }

    // function handleDelete(_id: string) {
    //     throw new Error("Function not implemented.");
    }

    function handleStatusChange(_id: string, value: string): void {
        throw new Error("Function not implemented.");
    }

    function handleDelete(_id: string) {
        throw new Error("Function not implemented.");
    }

        return (
            <ProtectedRoute>
                <div className="flex flex-col h-screen bg-gray-100">
                    <nav className="bg-red-500 text-white p-4 shadow-lg flex justify-between">
                        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
                        <div className="flex space-x-4">
                            {["All", "pending", "success", "dispatch"].map((status) => (
                                <button
                                    key={status}
                                    className={`px-4 py-2 rounded-lg transition-all ${
                                        filter === status
                                            ? "bg-white text-red-600 font-bold"
                                            : "text-black"
                                    }`}
                                    onClick={() => setFilter(status)}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                        
                    </nav>
                    <div className="flex-1 p-6 overflow-y-auto">
                        <h2 className="text-2xl text-black font-bold text-center">Orders</h2>
                     <div className="overflow-y-auto bg-white text-black rounded-lg shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200 text-sm lg:text-base">
                            <thead className="bg-gray-100 text-red-600">
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Address</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-black divide-gray-400">
                               {filteredOrders.map((order) => (
                                    <React.Fragment key={order._id}>
                                        <tr className="cursor-pointer text-black hover:bg-red-300 transition-all"onClick={()=>toggleOrderDetails(order._id)}>
                                         <td>{order._id}</td>
                                         <td>{order.firstName}{order.lastName}</td>
                                         <td>{order.address}</td>
                                         <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                         <td>${order.total}</td>
                                      
                                        <td>
                                        <select value={order.status || ""}onChange={(e)=>handleStatusChange(order._id,e.target.value)}
                                            className="bg-gray-400 text-black p-1 rounded">
                                                
                                                 <option value="pending">Pending</option>
                                                 <option value="success">Success</option>
                                                 <option value="dispatch">Dispatch</option>
                                                 <option value="cancelled">Cancelled</option>

                                                 

                                        </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={(e)=>{
                                                 e.stopPropagation();
                                                 handleDelete(order._id)
                                            }} className="bg-red-400 text-black  px-3 py-1 rounded hover:bg-red-800 transition ">
                                           Delete
                                            </button>
                                        </td>
                                        </tr>
                                        {selectedOrderId === order._id &&(
                                            <tr>
                                                <td colSpan={7}className="bg-white text-black p-4 transition-all animate-fadeIn">
                                                    <h3 className="font-bold">order detail</h3>
                                                    <p>Phone:<strong>{order.phone}</strong></p>
                                                     <p>Email:<strong>{order.email}</strong></p>
                                                     <p>City:<strong>{order.city}</strong></p>
                                                     <ul>
                                                        {order.cartItems.map((item)=>(
                                                            <li className="flex items-center gap-2" key={`${order._id}`}>
                                                                 {item.title}
                                                                  {item.productImage && (
                                                                    <Image
                                                                    src={urlFor(item.productImage).url()}
                                                                    alt="image"
                                                                    width={100}
                                                                    height={100}/>
                                                                 )}
                                                            </li>
                                                        ))}
                                                     </ul>
                                                </td>
                                            </tr>
                                        )}
                                 </React.Fragment>
                               ))}
                            </tbody>
                        </table>

                     </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
        
    }
