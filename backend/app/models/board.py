from pydantic import BaseModel, Field
from typing import Dict, Any


class ThemeConfig(BaseModel):
    board_id: str
    primary_font: str
    accent_font: str
    background_color: str
    text_color: str
    accent_color: str
    border_style: str
    ascii_art: str


class Board(BaseModel):
    id: str
    name: str = Field(..., min_length=1, max_length=50)
    display_name: str = Field(..., min_length=1, max_length=100)
    theme_config: ThemeConfig
    description: str = Field(..., max_length=500)
    cluster_name: str  # MongoDB cluster identifier

    class Config:
        json_schema_extra = {
            "example": {
                "id": "crypt",
                "name": "crypt",
                "display_name": "The Crypt",
                "theme_config": {
                    "board_id": "crypt",
                    "primary_font": "Creepster",
                    "accent_font": "Courier New",
                    "background_color": "#0a0a0a",
                    "text_color": "#00ff00",
                    "accent_color": "#ff0000",
                    "border_style": "double",
                    "ascii_art": "💀 THE CRYPT 💀"
                },
                "description": "Where threads rest... eternally",
                "cluster_name": "crypt_cluster"
            }
        }


class BoardResponse(BaseModel):
    id: str
    name: str
    display_name: str
    theme_config: ThemeConfig
    description: str

    class Config:
        from_attributes = True
