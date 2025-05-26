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


class DSPyPredictComponent(Component):
    display_name = "DSPy Predict"
    description = "Use DSPy for structured prediction with language models"
    documentation = "https://dspy-docs.vercel.app/"
    icon = "Zap"
    name = "DSPyPredict"

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
            value="Answer the question accurately and concisely.",
        ),
        MessageTextInput(
            name="input_value",
            display_name="Input Value",
            info="The input value to process",
            required=True,
        ),
    ]

    outputs = [
        Output(
            display_name="DSPy Response",
            name="response",
            method="run_dspy_predict",
        ),
    ]

    def run_dspy_predict(self) -> Message:
        if not DSPY_AVAILABLE:
            raise ImportError(
                "DSPy is not installed. Please install it with: pip install dspy-ai"
            )

        try:
            # Configure DSPy with the provided model
            # Note: This is a simplified setup - in practice, you'd need to
            # properly configure the DSPy model based on the LangChain model type
            
            # Create a simple signature
            signature = f"{self.input_field} -> {self.output_field}"
            
            # Create a predict module
            class SimplePredictModule(dspy.Module):
                def __init__(self, signature, description):
                    super().__init__()
                    self.predict = dspy.Predict(signature)
                    self.description = description
                
                def forward(self, **kwargs):
                    return self.predict(**kwargs)
            
            # Initialize the module
            module = SimplePredictModule(signature, self.signature_description)
            
            # Create input dictionary
            input_dict = {self.input_field: self.input_value}
            
            # Run prediction
            result = module(**input_dict)
            
            # Extract the output
            output_value = getattr(result, self.output_field, str(result))
            
            return Message(text=str(output_value))
            
        except Exception as e:
            error_msg = f"DSPy prediction failed: {str(e)}"
            self.log(error_msg)
            return Message(text=error_msg)
