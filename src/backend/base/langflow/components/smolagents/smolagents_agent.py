from typing import Any, List, Optional

try:
    from smolagents import ToolCallingAgent, Tool
    SMOLAGENTS_AVAILABLE = True
except ImportError:
    SMOLAGENTS_AVAILABLE = False
    ToolCallingAgent = None
    Tool = None

from langflow.base.huggingface.model_bridge import LangChainHFModel
from langflow.custom import Component
from langflow.io import (
    HandleInput,
    MessageTextInput,
    MultilineInput,
    Output,
)
from langflow.schema.message import Message


class SmolagentsAgentComponent(Component):
    display_name = "Smolagents Agent"
    description = "Create a HuggingFace Smolagents tool-calling agent"
    documentation = "https://huggingface.co/docs/smolagents/"
    icon = "HuggingFace"
    name = "SmolagentsAgent"

    inputs = [
        HandleInput(
            name="model",
            display_name="Language Model",
            input_types=["LanguageModel"],
            info="Language model to use for the agent",
            required=True,
        ),
        HandleInput(
            name="tools",
            display_name="Tools",
            input_types=["Tool"],
            is_list=True,
            info="List of tools available to the agent",
        ),
        MultilineInput(
            name="system_prompt",
            display_name="System Prompt",
            info="System prompt that defines the agent's behavior",
            value="You are a helpful AI assistant. Use the available tools to help answer questions.",
        ),
        MessageTextInput(
            name="user_message",
            display_name="User Message",
            info="Message from the user to process",
            required=True,
        ),
    ]

    outputs = [
        Output(
            display_name="Agent Response",
            name="response",
            method="run_agent",
        ),
    ]

    def run_agent(self) -> Message:
        if not SMOLAGENTS_AVAILABLE:
            raise ImportError(
                "Smolagents is not installed. Please install it with: pip install smolagents"
            )

        # Convert LangChain model to HuggingFace format
        hf_model = LangChainHFModel(chat_model=self.model)

        # Convert LangChain tools to HuggingFace format
        hf_tools = []
        if self.tools:
            for tool in self.tools:
                try:
                    hf_tool = Tool.from_langchain(tool)
                    hf_tools.append(hf_tool)
                except Exception as e:
                    self.log(f"Failed to convert tool {tool}: {e}")

        # Create the agent
        agent = ToolCallingAgent(
            model=hf_model,
            tools=hf_tools,
            system_prompt=self.system_prompt,
        )

        # Run the agent
        try:
            result = agent.run(self.user_message)
            return Message(text=str(result))
        except Exception as e:
            error_msg = f"Agent execution failed: {str(e)}"
            self.log(error_msg)
            return Message(text=error_msg)
