<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import * as chat from "../../application/services/chatService";
    import { currentPage, navigateTo } from '../../lib/stores/navigation';
    import { conversationsStore, refreshConversations } from '../../lib/stores/conversations';
    import type { IPopulatedConversation } from '../../domain';

    let { conversationId } = $props();

    let conversations: IPopulatedConversation[] = [];

    conversationsStore.subscribe(value => {
        conversations = value;
    });

    let socket = $state<any>(null);
    let messages = $state<Array<{ from: any; text: string; createdAt?: string }>>([]);
    let text = $state("");
    let username = $state("anonymous");
    let unauthorized = $state(false);
    let messagesContainer = $state<HTMLElement>();
    let typingUsers = $state<Set<string>>(new Set());
    let typingTimeout = $state<number | null>(null);

    let conversationName = $state<string>("");

    $effect(() => {
        const convo = conversations.find(c => c._id === conversationId);
        if (convo) {
            conversationName = convo.name || "Unnamed Conversation";
        } else {
            conversationName = "Conversation Not Found";
        }
    });

    $effect(() => {
        if (messagesContainer) {
            console.log("Messages container assigned:", messagesContainer);
        }
    });

    const userData = localStorage.getItem("user");
    if (userData) {
        try {
            const user = JSON.parse(userData);
            username = user.username;
        } catch (e) {
            console.error("Failed to parse user data", e);
        }
    }

    $effect(() => {
        messages;
        if (messagesContainer) {
            console.log("Auto-scrolling to bottom, messages count:", messages.length);
            setTimeout(() => {
                if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            }, 10);
        }
    });

    let initialized = $state(false);

    $effect(() => {
        if (conversationId && socket && initialized) {
            console.log("Conversation ID changed, reloading messages and rejoining room for:", conversationId);
            loadMessages();
            // Leave previous conversation and join new one
            socket.emit("joinConversation", conversationId);
        }
    });

    onMount(async () => {
        console.log("test", conversationName)
        socket = await chat.connectToChat();
        socket.on("connect", () => {
            console.log("connected to socket.io");
            socket.emit("joinConversation", conversationId);
        });
        socket.on("message", (payload: any) => {
            console.log("Received message:", payload);
            if (payload.conversationId === conversationId) {
                console.log("Adding message to conversation");
                messages = [...messages, payload];
            } else {
                console.log(
                    "Message not for this conversation:",
                    payload.conversationId,
                    "vs",
                    conversationId
                );
            }
        });
        socket.on("typing", (payload: any) => {
            console.log("Received typing event:", payload);
            if (payload.conversationId === conversationId && payload.userId !== username) {
                if (payload.isTyping) {
                    typingUsers.add(payload.userId);
                } else {
                    typingUsers.delete(payload.userId);
                }
                // Trigger reactivity
                typingUsers = new Set(typingUsers);
            }
        });
        socket.on("error", (msg: any) => {
            if (typeof msg === "string" && msg.includes("Unauthorized")) {
                unauthorized = true;
            }
        });
        socket.on("disconnect", (reason: string) => {
            if (reason === "io server disconnect") {
                unauthorized = true;
            }
        });

        // Load initial messages
        await loadMessages();
        initialized = true;
    });

    async function loadMessages() {
        try {
            const data: any = await chat.fetchHistory(conversationId);
            console.log("Fetched history for conversation", conversationId, ":", data);
            messages = data.map((m: any) => ({
                from: m.from,
                text: m.text,
                createdAt: m.createdAt,
            }));
            console.log("Mapped messages for conversation", conversationId, ":", messages);
        } catch (err) {
            console.error("failed to load history for conversation", conversationId, err);
        }
    }

    onDestroy(() => {
        console.log(
            "Destroying chat component, leaving conversation:",
            conversationId
        );
        chat.leaveChat();
    });

    function handleInput() {
        // Start typing indicator when user types 3+ characters
        if (text.length >= 3) {
            chat.sendTyping(conversationId, true);

            // Clear existing timeout
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }

            // Set timeout to stop typing after 1 second of inactivity
            typingTimeout = setTimeout(() => {
                chat.sendTyping(conversationId, false);
                typingTimeout = null;
            }, 3000);
        } else if (text.length === 0) {
            // Stop typing when input is cleared
            chat.sendTyping(conversationId, false);
            if (typingTimeout) {
                clearTimeout(typingTimeout);
                typingTimeout = null;
            }
        }
    }

    function openConversationSettings() {
        navigateTo('conversation-settings', conversationId);
    }

    function getTypingIndicatorText() {
        const typingArray = Array.from(typingUsers);
        if (typingArray.length === 0) return '';

        if (typingArray.length === 1) {
            return `${typingArray[0]} est en train d'écrire...`;
        } else if (typingArray.length === 2) {
            return `${typingArray[0]} et ${typingArray[1]} sont en train d'écrire...`;
        } else {
            return `${typingArray[0]} et ${typingArray.length - 1} autres sont en train d'écrire...`;
        }
    }
</script>

{#if unauthorized}
    <div style="color: red; font-weight: bold;">
        Not authorized. Please login to access the chat.
    </div>
{:else}
    <div class="chat">
        <div class="chat-header">
            <h2 style="margin: 0;">Chat : {conversationName}</h2>
            <button onclick={openConversationSettings} class="settings-btn" title="Conversation Settings">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="15" height="15"><path fill="#fff" d="M195.1 9.5C198.1-5.3 211.2-16 226.4-16l59.8 0c15.2 0 28.3 10.7 31.3 25.5L332 79.5c14.1 6 27.3 13.7 39.3 22.8l67.8-22.5c14.4-4.8 30.2 1.2 37.8 14.4l29.9 51.8c7.6 13.2 4.9 29.8-6.5 39.9L447 233.3c.9 7.4 1.3 15 1.3 22.7s-.5 15.3-1.3 22.7l53.4 47.5c11.4 10.1 14 26.8 6.5 39.9l-29.9 51.8c-7.6 13.1-23.4 19.2-37.8 14.4l-67.8-22.5c-12.1 9.1-25.3 16.7-39.3 22.8l-14.4 69.9c-3.1 14.9-16.2 25.5-31.3 25.5l-59.8 0c-15.2 0-28.3-10.7-31.3-25.5l-14.4-69.9c-14.1-6-27.2-13.7-39.3-22.8L73.5 432.3c-14.4 4.8-30.2-1.2-37.8-14.4L5.8 366.1c-7.6-13.2-4.9-29.8 6.5-39.9l53.4-47.5c-.9-7.4-1.3-15-1.3-22.7s.5-15.3 1.3-22.7L12.3 185.8c-11.4-10.1-14-26.8-6.5-39.9L35.7 94.1c7.6-13.2 23.4-19.2 37.8-14.4l67.8 22.5c12.1-9.1 25.3-16.7 39.3-22.8L195.1 9.5zM256.3 336a80 80 0 1 0 -.6-160 80 80 0 1 0 .6 160z"/></svg>
            </button>
        </div>
        <div
            class="messages"
            style="height: 300px; overflow: auto; padding: 8px;"
            bind:this={messagesContainer}
        >
        {#each messages as m}
            <div class="message">
                <strong style="color: {m.from?.options?.color || '#fff'}">
                    {m.from?.username || m.from}
                </strong>
                : {m.text}
            </div>
        {/each}
        </div>
        <div class="input-area">
            {#if getTypingIndicatorText()}
                <div class="typing-indicator">
                    {getTypingIndicatorText()}
                </div>
            {/if}
            <div class="input-row">
                <input
                    placeholder="message"
                    bind:value={text}
                    oninput={handleInput}
                    onkeydown={(e) => {
                        if (e.key === "Enter") {
                            const payload = { text, conversationId };
                            console.log("Sending message:", payload);
                            try {
                                chat.sendMessage(payload);
                                text = "";
                                // Stop typing when sending message
                                chat.sendTyping(conversationId, false);
                                if (typingTimeout) {
                                    clearTimeout(typingTimeout);
                                    typingTimeout = null;
                                }
                            } catch (err) {
                                alert("not connected");
                            }
                        }
                    }}
                />
                <button onclick={() => {
                    const payload = { text, conversationId };
                    console.log("Sending message:", payload);
                    try {
                        chat.sendMessage(payload);
                        text = "";
                        // Stop typing when sending message
                        chat.sendTyping(conversationId, false);
                        if (typingTimeout) {
                            clearTimeout(typingTimeout);
                            typingTimeout = null;
                        }
                    } catch (err) {
                        alert("not connected");
                    }
                }}>Send</button>
            </div>
        </div>
    </div>
{/if}

<style>
    .chat {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 17px;
        background: #2f3136;
        border-bottom: 1px solid #40444b;
    }

    .settings-btn {
        background: #5a6fd8;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        padding: 0;
    }

    .settings-btn:hover {
        background: #40444b;
    }

    .messages {
        flex: 1;
        background: #36393f;
        color: white;
        padding: 10px;
        overflow-y: auto;
    }

    .message {
        margin-bottom: 10px;
    }

    .input-area {
        display: flex;
        flex-direction: column;
        padding: 10px;
        background: #2f3136;
    }

    .typing-indicator {
        font-size: 12px;
        color: #b9bbbe;
        margin-bottom: 5px;
        font-style: italic;
    }

    .input-row {
        display: flex;
    }

    input {
        flex: 1;
        padding: 8px;
        margin-right: 10px;
    }

    button {
        padding: 8px 16px;
        background: #5865f2;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background: #4752c4;
    }
</style>
