from typing import Any, Dict, Optional

try:
    import dspy
    DSPY_AVAILABLE = True
except ImportError:
    DSPY_AVAILABLE = False
    dspy = None

from langflow.custom import Component
from langflow.io import (
    HandleInput,
    MessageTextInput,
    MultilineInput,
    Output,
)
from langflow.schema.message import Message


class DSPyChainOfThoughtComponent(Component):
    display_name = "DSPy Chain of Thought"
    description = "Use DSPy Chain of Thought reasoning for complex problem solving"
    documentation = "https://dspy-docs.vercel.app/"
    icon = "Brain"
    name = "DSPyChainOfThought"

    inputs = [
        HandleInput(
            name="model",
            display_name="Language Model",
            input_types=["LanguageModel"],
            info="Language model to use for DSPy",
            required=True,
        ),
        MessageTextInput(
            name="input_field",
            display_name="Input Field Name",
            info="Name of the input field for the signature",
            value="question",
        ),
        MessageTextInput(
            name="output_field",
            display_name="Output Field Name",
            info="Name of the output field for the signature",
            value="answer",
        ),
        MultilineInput(
            name="signature_description",
            display_name="Signature Description",
            info="Description of what the model should do",
            value="Think step by step to answer the question accurately.",
        ),
        MessageTextInput(
            name="input_value",
            display_name="Input Value",
            info="The input value to process with chain of thought",
            required=True,
        ),
    ]

    outputs = [
        Output(
            display_name="CoT Response",
            name="response",
            method="run_chain_of_thought",
        ),
        Output(
            display_name="Reasoning",
            name="reasoning",
            method="get_reasoning",
        ),
    ]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._last_result = None

    def run_chain_of_thought(self) -> Message:
        if not DSPY_AVAILABLE:
            raise ImportError(
                "DSPy is not installed. Please install it with: pip install dspy-ai"
            )

        try:
            # Create a chain of thought signature
            signature = f"{self.input_field} -> rationale, {self.output_field}"
            
            # Create a chain of thought module
            class ChainOfThoughtModule(dspy.Module):
                def __init__(self, signature, description):
                    super().__init__()
                    self.cot = dspy.ChainOfThought(signature)
                    self.description = description
                
                def forward(self, **kwargs):
                    return self.cot(**kwargs)
            
            # Initialize the module
            module = ChainOfThoughtModule(signature, self.signature_description)
            
            # Create input dictionary
            input_dict = {self.input_field: self.input_value}
            
            # Run chain of thought
            result = module(**input_dict)
            self._last_result = result
            
            # Extract the output
            output_value = getattr(result, self.output_field, str(result))
            
            return Message(text=str(output_value))
            
        except Exception as e:
            error_msg = f"DSPy Chain of Thought failed: {str(e)}"
            self.log(error_msg)
            return Message(text=error_msg)

    def get_reasoning(self) -> Message:
        if self._last_result and hasattr(self._last_result, 'rationale'):
            return Message(text=str(self._last_result.rationale))
        return Message(text="No reasoning available. Run the chain of thought first.")
