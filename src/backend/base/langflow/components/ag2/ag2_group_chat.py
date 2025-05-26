from typing import Any, List, Optional

try:
    from ag2 import GroupChat, GroupChatManager
    AG2_AVAILABLE = True
except ImportError:
    AG2_AVAILABLE = False
    GroupChat = None
    GroupChatManager = None

from langflow.custom import Component
from langflow.io import (
    BoolInput,
    HandleInput,
    IntInput,
    MessageTextInput,
    MultilineInput,
    Output,
)
from langflow.schema.message import Message


class AG2GroupChatComponent(Component):
    display_name = "AG2 Group Chat"
    description = "Create an AG2 group chat with multiple agents for collaborative conversations"
    documentation = "https://ag2.ai/"
    icon = "Users"
    name = "AG2GroupChat"

    inputs = [
        HandleInput(
            name="agents",
            display_name="Agents",
            input_types=["AG2Agent"],
            is_list=True,
            info="List of AG2 agents to participate in the group chat",
            required=True,
        ),
        MessageTextInput(
            name="initial_message",
            display_name="Initial Message",
            info="Initial message to start the group conversation",
            required=True,
        ),
        IntInput(
            name="max_round",
            display_name="Max Rounds",
            info="Maximum number of conversation rounds",
            value=10,
        ),
        BoolInput(
            name="admin_name",
            display_name="Admin Name",
            info="Name of the admin/manager agent",
            value="Admin",
        ),
        MultilineInput(
            name="admin_system_message",
            display_name="Admin System Message",
            info="System message for the group chat manager",
            value="You are the group chat manager. Coordinate the conversation between agents.",
            advanced=True,
        ),
    ]

    outputs = [
        Output(
            display_name="Conversation Result",
            name="result",
            method="run_group_chat",
        ),
    ]

    def run_group_chat(self) -> Message:
        if not AG2_AVAILABLE:
            raise ImportError(
                "AG2 is not installed. Please install it with: pip install ag2"
            )

        if not self.agents:
            raise ValueError("At least one agent is required for group chat")

        # Create group chat
        group_chat = GroupChat(
            agents=self.agents,
            messages=[],
            max_round=self.max_round,
        )

        # Create group chat manager
        manager = GroupChatManager(
            groupchat=group_chat,
            name=self.admin_name,
            system_message=self.admin_system_message,
        )

        # Start the conversation
        result = self.agents[0].initiate_chat(
            manager,
            message=self.initial_message,
        )

        # Extract the conversation history
        conversation_text = ""
        for message in group_chat.messages:
            speaker = message.get("name", "Unknown")
            content = message.get("content", "")
            conversation_text += f"{speaker}: {content}\n\n"

        return Message(text=conversation_text)
