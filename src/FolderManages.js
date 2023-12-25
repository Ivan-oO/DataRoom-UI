import React, { useState, useEffect } from 'react';
import './FolderManager.css';
import SecurityCheck from './SecurityCheck';
import { downloadFile } from './fileDownload'; // Adjust the path according to your file structure

function FolderManager() {
    const [folders, setFolders] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [animateFolderIndex, setAnimateFolderIndex] = useState(null);
    const [showFloatingPage, setShowFloatingPage] = useState(true);
    const [viewingFolder, setViewingFolder] = useState(null);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, index: -1 });
    const [contextMenuClickCount, setContextMenuClickCount] = useState(0);
    const [showSecurityCheck, setShowSecurityCheck] = useState(false);
    const [fileContextMenu, setFileContextMenu] = useState({ visible: false, x: 0, y: 0, fileIndex: -1, folderIndex: -1 });
    const fileExtensions = ['txt', 'jpg', 'pdf', 'docx', 'png'];

    const handleFileContextMenu = (event, folderIndex, fileIndex) => {
        event.preventDefault();
        setFileContextMenu({ visible: true, x: event.clientX, y: event.clientY, fileIndex, folderIndex });
    };

    const handleContextMenuClick = () => {
        setContextMenuClickCount(count => count + 1);
        if ((contextMenuClickCount + 1) % 3 === 0) {
            setShowSecurityCheck(true);
        }
    };

    const randomName = () => Math.random().toString(36).substr(2, 5);

    const generateRandomFiles = () => {
        const fileCount = Math.floor(Math.random() * 5) + 1;
        return Array.from({ length: fileCount }, () => `${randomName()}.${fileExtensions[Math.floor(Math.random() * fileExtensions.length)]}`);
    };


    const handleDoubleClickFolder = (index) => {
        // Get the selected folder
        const selectedFolder = folders[index];

        // Generate random files for the folder
        const filesForFolder = generateRandomFiles();

        // Update the viewingFolder state with the selected folder and its files
        setViewingFolder({ ...selectedFolder, files: filesForFolder });
    };


    const handleCloseFloatingPage = () => {
        setShowFloatingPage(false);
    };

    const generateShareLink = () => {
        return `https://example.com/folder/${Math.random().toString(36).substr(2, 9)}`;
    };

    const handleShareLink = (index) => {
        navigator.clipboard.writeText(folders[index].shareLink)
            .then(() => alert("Link copied to clipboard!"))
            .catch(err => console.error("Failed to copy link: ", err));
    };

    const handleNewFolder = () => {
        if (editingIndex === null) {
            const newFolder = {
                name: '',
                shareLink: generateShareLink(),
            };
            setFolders([...folders, newFolder]);
            setEditingIndex(folders.length); // set index for new folder
        } else {
            // Optionally, provide visual feedback that folder creation is not allowed during renaming
        }
    };

    const handleNameChange = (event, index) => {
        const updatedFolders = [...folders];
        updatedFolders[index] = { ...updatedFolders[index], name: event.target.value };
        setFolders(updatedFolders);
    };

    const handleKeyPress = (event, index) => {
        if (event.key === 'Enter') {
            finishEditing(index);
        }
    };

    const finishEditing = (index) => {
        const uniqueNames = new Set(folders.map(folder => folder.name));
        if (uniqueNames.size !== folders.length) {
            triggerAnimation(index);
            // Do not set editingIndex to null if the name is not unique
        } else {
            setEditingIndex(null);
        }
    };

    const triggerAnimation = (index) => {
        setAnimateFolderIndex(index);
        setTimeout(() => {
            setAnimateFolderIndex(null);
        }, 1000); // Animation lasts for 1 second
    };

    const handleClickFolder = (index) => {
        // Placeholder for folder click functionality
        alert(`Folder clicked: ${folders[index]}`);
    };


    const handleContextMenu = (event, index) => {
        if (editingIndex === null) {
            event.preventDefault();
            setContextMenu({ visible: true, x: event.clientX, y: event.clientY, index: index });
        }
    };

    const handleDelete = () => {
        handleContextMenuClick();
        if (editingIndex === null && window.confirm('Are you sure you want to delete this folder?')) {
            setFolders(folders.filter((_, idx) => idx !== contextMenu.index));
            setContextMenu({ visible: false, x: 0, y: 0, index: -1 });
        }
    };


    const handleRename = () => {
        handleContextMenuClick();
        setEditingIndex(contextMenu.index);
        setContextMenu({ visible: false, x: 0, y: 0, index: -1 });
    };

    useEffect(() => {
        // Safely focus on the input field of the new/renaming folder
        const inputElement = document.getElementById(`folder-input-${editingIndex}`);
        if (inputElement) {
            inputElement.focus();
        }
    }, [editingIndex]);

    return (
        <div>
            {viewingFolder === null ? (
                <div>
                    <button onClick={handleNewFolder} disabled={editingIndex !== null}>Create New Folder</button>
                    <div className="folder-area">
                        {folders.map((folder, index) => (
                            <div
                                key={index}
                                className={`folder-shortcut ${editingIndex === index ? 'editing' : ''} ${animateFolderIndex === index ? 'animate' : ''}`}
                                onDoubleClick={() => handleDoubleClickFolder(index)}
                                onContextMenu={(e) => handleContextMenu(e, index)}
                            >
                                {editingIndex === index ? (
                                    <input
                                        id={`folder-input-${index}`}
                                        className={animateFolderIndex === index ? 'invalid-name' : ''}
                                        type="text"
                                        value={folder.name}
                                        onChange={(e) => handleNameChange(e, index)}
                                        onBlur={() => finishEditing(index)}
                                        onKeyDown={(e) => handleKeyPress(e, index)}
                                    />
                                ) : (
                                    <div onDoubleClick={() => handleDoubleClickFolder(index)}>{folder.name}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <button onClick={() => setViewingFolder(null)}>Back to Folders</button>
                    <h2>{viewingFolder.name}</h2>
                    <div className="file-system-area">
                        {viewingFolder.files.map((file, fileIndex) => (
                            <div key={fileIndex} className="file-shortcut" onContextMenu={(e) => handleFileContextMenu(e, viewingFolder, fileIndex)}>
                                <span>{file}</span>
                            </div>
                        ))}

                    </div>

                    {/* File context menu */}
                    {fileContextMenu.visible && (
                        <div className="context-menu" style={{ top: `${fileContextMenu.y}px`, left: `${fileContextMenu.x}px` }}>
                            <div onClick={() => downloadFile(viewingFolder.files[fileContextMenu.fileIndex])}>Download File</div>
                        </div>
                    )}
                </div>

            )}
            {contextMenu.visible && (
                <div
                    className="context-menu"
                    style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
                >
                    <div onClick={handleRename}>Rename</div>
                    <div onClick={handleDelete}>Delete</div>
                    <div onClick={() => handleShareLink(contextMenu.index)}>Share Link</div>
                </div>
            )}
            {showFloatingPage && (
                <div className="floating-page">
                    <div className="floating-content">
                        <button className="close-button" onClick={handleCloseFloatingPage}>×</button>
                        <p>Registration complete, congratz! Now scan this QR code:</p>
                        {/* Add your QR code here */}
                        <div className="qr-code">[QR Code Here]</div>
                    </div>
                </div>
            )}
            {showSecurityCheck && (
                <SecurityCheck
                    onClose={() => setShowSecurityCheck(false)}
                // onCodeSubmit={/* your submit logic */}
                />
            )}
        </div>
    );
}

export default FolderManager;
