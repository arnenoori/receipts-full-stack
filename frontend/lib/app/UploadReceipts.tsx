import React from 'react';
import { Title, Text } from '@tremor/react';
import Input from "frontend/lib/app/components/ui/input";
import Label from "frontend/lib/app/components/ui/label";
import Button from "frontend/lib/app/components/ui/button";

const Component: React.FC = () => {
    return (
        <div className="min-h-screen">
            <header className="p-6 flex items-center space-x-4">
                <Title>Upload Receipts</Title>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                            <div className="space-y-1">
                                <svg
                                    className=" w-12 h-12 mx-auto"
                                    fill="none"
                                    height="24"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
                                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                                    <path d="M12 17V7" />
                                </svg>
                                <div className="flex text-sm">
                                    <Label
                                        className="relative rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                                        htmlFor="receipts"
                                    >
                                        <span>Upload a file</span>
                                        <Input className="sr-only" id="receipts" multiple type="file" />
                                    </Label>
                                    <Text className="pl-1">or drag and drop</Text>
                                </div>
                                <Text className="text-xs">PNG, JPG, PDF up to 2MB</Text>
                                <Text className="text-xs">File will be uploaded automatically</Text>
                            </div>
                        </div>
                        <div className="h-2 bg-gray-200 mt-2">
                            <div
                                className="h-2 bg-green-500"
                                style={{
                                    width: "70%",
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <Title className="text-2xl font-bold">Or Enter Receipt Manually</Title>
                    <div className="mt-6 grid grid-cols-2 gap-6">
                        <div className="col-span-2 sm:col-span-1">
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="store-name">
                                Store Name
                            </Label>
                            <Input
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                id="store-name"
                                name="store-name"
                                type="text"
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="date">
                                Date
                            </Label>
                            <Input
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                id="date"
                                name="date"
                                type="date"
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="item">
                            Item
                        </Label>
                        <Input
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            id="item"
                            name="item"
                            type="text"
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="price">
                                Price
                            </Label>
                            <Input
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                id="price"
                                name="price"
                                type="text"
                            />
                        </div>
                        <div className="col-span-2">
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="tax">
                                Tax
                            </Label>
                            <Input
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                id="tax"
                                name="tax"
                                type="number"
                            />
                        </div>
                        <div className="col-span-2">
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="total">
                                Total
                            </Label>
                            <Input
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                id="total"
                                name="total"
                                type="number"
                            />
                        </div>
                        <div className="col-span-2">
                            <Button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded" type="button">
                                Add New Item
                            </Button>
                        </div>
                    </div>
                    <div className="flex justify-end mt-6">
                        <Button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded" type="submit">
                            Enter Receipt
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Component;
