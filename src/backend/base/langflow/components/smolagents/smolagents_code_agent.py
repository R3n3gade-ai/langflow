from typing import Any, List, Optional

try:
    from smolagents import CodeAgent, Tool
    SMOLAGENTS_AVAILABLE = True
except ImportError:
    SMOLAGENTS_AVAILABLE = False
    CodeAgent = None
    Tool = None

from langflow.base.huggingface.model_bridge import LangChainHFModel
from langflow.custom import Component
from langflow.io import (
    BoolInput,
    HandleInput,
    MessageTextInput,
    MultilineInput,
    Output,
)
from langflow.schema.message import Message


class SmolagentsCodeAgentComponent(Component):
    display_name = "Smolagents Code Agent"
    description = "Create a HuggingFace Smolagents code-executing agent"
    documentation = "https://huggingface.co/docs/smolagents/"
    icon = "HuggingFace"
    name = "SmolagentsCodeAgent"

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
            value="You are a helpful AI assistant that can write and execute Python code. Use code to solve problems when appropriate.",
        ),
        MessageTextInput(
            name="user_message",
            display_name="User Message",
            info="Message from the user to process",
            required=True,
        ),
        BoolInput(
            name="verbose",
            display_name="Verbose",
            info="Whether to show detailed execution logs",
            value=False,
            advanced=True,
        ),
    ]

    outputs = [
        Output(
            display_name="Agent Response",
            name="response",
            method="run_code_agent",
        ),
    ]

    def run_code_agent(self) -> Message:
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

        # Create the code agent
        agent = CodeAgent(
            model=hf_model,
            tools=hf_tools,
            system_prompt=self.system_prompt,
            verbose=self.verbose,
        )

        # Run the agent
        try:
            result = agent.run(self.user_message)
            return Message(text=str(result))
        except Exception as e:
            error_msg = f"Code agent execution failed: {str(e)}"
            self.log(error_msg)
            return Message(text=error_msg)
