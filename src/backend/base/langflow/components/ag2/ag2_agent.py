from typing import Any, Dict, List, Optional

try:
    from ag2 import ConversableAgent
    AG2_AVAILABLE = True
except ImportError:
    AG2_AVAILABLE = False
    ConversableAgent = None

from langflow.custom import Component
from langflow.io import (
    BoolInput,
    DictInput,
    HandleInput,
    IntInput,
    MessageTextInput,
    MultilineInput,
    Output,
)
from langflow.schema.message import Message


class AG2AgentComponent(Component):
    display_name = "AG2 Agent"
    description = "Create an AG2 (AutoGen 2.0) conversable agent for multi-agent conversations"
    documentation = "https://ag2.ai/"
    icon = "Bot"
    name = "AG2Agent"

    inputs = [
        MessageTextInput(
            name="name",
            display_name="Agent Name",
            info="Name of the agent",
            value="Assistant",
            required=True,
        ),
        MultilineInput(
            name="system_message",
            display_name="System Message",
            info="System message that defines the agent's role and behavior",
            value="You are a helpful AI assistant.",
            required=True,
        ),
        HandleInput(
            name="llm_config",
            display_name="LLM Config",
            input_types=["LanguageModel"],
            info="Language model configuration for the agent",
            required=True,
        ),
        BoolInput(
            name="human_input_mode",
            display_name="Human Input Mode",
            info="Whether to request human input during conversation",
            value=False,
        ),
        IntInput(
            name="max_consecutive_auto_reply",
            display_name="Max Auto Replies",
            info="Maximum number of consecutive auto replies",
            value=10,
            advanced=True,
        ),
        DictInput(
            name="code_execution_config",
            display_name="Code Execution Config",
            info="Configuration for code execution capabilities",
            advanced=True,
        ),
    ]

    outputs = [
        Output(
            display_name="AG2 Agent",
            name="agent",
            method="build_agent",
        ),
    ]

    def build_agent(self) -> Any:
        if not AG2_AVAILABLE:
            raise ImportError(
                "AG2 is not installed. Please install it with: pip install ag2"
            )

        # Convert LangChain model to AG2 config format
        llm_config = {
            "model": getattr(self.llm_config, "model_name", "gpt-4"),
            "api_key": getattr(self.llm_config, "api_key", None),
            "base_url": getattr(self.llm_config, "base_url", None),
            "temperature": getattr(self.llm_config, "temperature", 0.7),
        }

        # Filter out None values
        llm_config = {k: v for k, v in llm_config.items() if v is not None}

        agent = ConversableAgent(
            name=self.name,
            system_message=self.system_message,
            llm_config=llm_config,
            human_input_mode="ALWAYS" if self.human_input_mode else "NEVER",
            max_consecutive_auto_reply=self.max_consecutive_auto_reply,
            code_execution_config=self.code_execution_config or False,
        )

        return agent
