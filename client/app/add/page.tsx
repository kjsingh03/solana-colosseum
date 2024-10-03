"use client";
import { defImg, edit, trash } from '@/assets';
import { setAlert } from '@/store/slices';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';

type categories = {
    name: string,
    maxTickets: string
}

export default function Page() {
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        thumbnail: null,
        categories: [{ name: '', maxTickets: '' }]
    });

    const [errors, setErrors] = useState({
        name: '',
        date: '',
        thumbnail: '',
        categories: [{ name: '', maxTickets: '' }]
    });

    const dispatch = useDispatch();
    const router = useRouter();

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index?: number) => {
        const { name, value, type, files } = e.target as HTMLInputElement | HTMLSelectElement & { files?: FileList };

        if (index !== undefined) {
            const newCategories: categories[] = [...formData.categories];
            (newCategories[index] as any)[name] = value;
            setFormData({ ...formData, categories: newCategories });
        }
        else if (type === 'file' && files) {
            setFormData((p) => ({ ...p, [name]: files[0], }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const addCategory = () => {
        setFormData({
            ...formData,
            categories: [...formData.categories, { name: '', maxTickets: '' }]
        });
    };

    const removeCategory = (index: number) => {
        const newCategories = formData.categories.filter((_, i) => i !== index);
        setFormData({ ...formData, categories: newCategories });
    };

    const validateForm = () => {
        const newErrors = { name: '', date: '', thumbnail: '', categories: [{ name: '', maxTickets: '' }] };
        let valid = true;

        if (!formData.name) {
            newErrors.name = 'Field is required';
            valid = false;
        }
        if (!formData.date) {
            newErrors.date = 'Field is required';
            valid = false;
        }
        if (!formData.thumbnail) {
            newErrors.thumbnail = 'Field is required';
            valid = false;
        }
        formData.categories.forEach((category, index) => {
            if (!category.name) {
                newErrors.categories[index] = { ...newErrors.categories[index], name: 'Category name is required' };
                valid = false;
            }
            if (!category.maxTickets || isNaN(parseInt(category.maxTickets))) {
                newErrors.categories[index] = { ...newErrors.categories[index], maxTickets: 'Enter valid ticket count' };
                valid = false;
            }
        });

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (validateForm()) {
            if (!formData.thumbnail) {
                console.error('No thumbnail');
                return;
            }

            const data = new FormData();
            data.append("file", (formData.thumbnail));
            data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string);
            data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string);

            try {
                const thumbnailResponse = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, data);

                const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/concert`, { ...formData, thumbnail: thumbnailResponse.data.secure_url },{
                    headers:{
                        Authorization:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImsuanNpbmdoLjEyMDAzQGdtYWlsLmNvbSIsImlhdCI6MTcyNzg4ODI4N30.LA6dB0Iwko0x3Z3-5AXZw_IssS6uPSkbkmHzNnObs2E'
                    }
                });
                console.log(res)

                dispatch(setAlert({ message: res.data.message, type: 'success' }))

                // setTimeout(() => router.push('/'), 1000);


            } catch (e: any) {
                dispatch(setAlert({ message: e.response.data.message, type: 'error' }))
                console.log(e)
            }
            finally {
                setTimeout(() => dispatch(setAlert({ message: '', type: 'error' })), 1200)
            }
        }
        console.log(formData)
    };

    const { thumbnail } = formData;

    const handleDragOver = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        (document.getElementById("thumbnail") as HTMLInputElement).files = dataTransfer.files;
    };

    const clearThumbnail = () => {
        setFormData((p: any) => ({ ...p, thumbnail: null })); 
    }

    console.log(formData)

    return (
        <div className="w-[80%] mx-auto py-24">
            <div className="flex flex-col gap-2 ">
                <h1 className="text-3xl">Add Concert</h1>

                <div className="h-[64px] flex justify-end flex-col relative">
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Concert Name" className="form-input text-[14px] outline-none border-b bg-transparent border-[#D0D2D5] py-2.5 px-1" />
                    {errors.name && <p className="text-red-500 text-xs absolute -bottom-5">{errors.name}</p>}
                    <label htmlFor="name" className="form-label text-[12px] font-[500]">Name</label>
                </div>

                <div className="h-[64px] flex justify-end flex-col relative">
                    <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className="form-input text-[14px] outline-none border-b bg-transparent border-[#D0D2D5] py-2.5 px-1" />
                    {errors.date && <p className="text-red-500 text-xs absolute -bottom-5">{errors.date}</p>}
                    <label htmlFor="date" className="form-label text-[12px] font-[500]">Date</label>
                </div>

                <div className="flex flex-col gap-[6px] max-w-96">
                    <div className=" w-[100%] z-[1] top-0 relative h-[260px]">

                        {
                            !thumbnail ?
                                <>
                                    <input type="file" className="z-0 opacity-0 h-full w-full absolute" id="thumbnail" accept="image/*" name="thumbnail" onChange={handleChange} onDragOver={handleDragOver} onDrop={handleDrop} />
                                    <label htmlFor="thumbnail" className="border-dashed border-2 h-full w-full border-gray-400 flex flex-col justify-center items-center gap-[39px]"              >
                                        <Image src={defImg} alt="Default Image Icon" />
                                        <p className="leading-6 text-[14px] font-popins text-[#676767] flex flex-wrap justify-center">
                                            Drag or upload your photo here
                                        </p>
                                    </label>
                                </>
                                :
                                <div className="rounded-lg w-[100%] border-gray-400 flex flex-col justify-center items-center gap-[39px]">
                                    <Image src={URL.createObjectURL(thumbnail)} fill objectFit='cover' className="rounded-lg bg-contain w-[100%] h-[100%]" alt="Preview Image" />
                                </div>
                        }

                    </div>
                    {
                        thumbnail && <div className="flex justify-between pt-2 px-1.5"><Image src={edit} alt='Edit' onClick={clearThumbnail} /><Image src={trash} alt='Trash' onClick={clearThumbnail} /></div>
                    }
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold">Categories</h2>
                    {formData.categories.map((category, index) => (
                        <div key={index} className="flex gap-4 relative mb-7">
                            <input type="text" name="name" value={category.name} onChange={(e) => handleChange(e, index)} placeholder="Category Name" className="form-input text-[14px] outline-none border-b bg-transparent border-[#D0D2D5] py-2.5 px-1" />
                            <input type="number" name="maxTickets" value={category.maxTickets} onChange={(e) => handleChange(e, index)} placeholder="Max Tickets" className="form-input text-[14px] outline-none border-b bg-transparent border-[#D0D2D5] py-2.5 px-1" />
                            <button type="button" onClick={() => removeCategory(index)}>Remove</button>
                            {errors.categories[index]?.name && <p className="text-red-500 text-xs absolute -bottom-5">{errors.categories[index]?.name}</p>}
                            {errors.categories[index]?.maxTickets && <p className="text-red-500 text-xs absolute -bottom-10">{errors.categories[index]?.maxTickets}</p>}
                        </div>
                    ))}
                    <button type="button" onClick={addCategory} className="bg-blue-500 text-white px-3 py-1 rounded">Add Category</button>
                </div>

                <div className="flex flex-col gap-[7px]">
                    <button onClick={handleSubmit} className="bg-gradient-cyan bg-gradient-cyan-hover text-white font-[500] font-popins text-[16px] p-[10px_14px] rounded-[36px]">Submit</button>
                </div>
            </div>
        </div>
    );
}
