from core.config import BLIZZARD_REGION


USE_MOCK = True



MOCK_ROSTER = {
    "guild": {
        "name": "EXQ",
        "realm": {"name": "Burning Legion"},
    },
    "members": [
        {
            "character": {
                "name": "Arthas",
                "level": 90,
                "playable_class": {"name": "Death Knight"},
                "playable_race": {"name": "Human"},
                "realm": {"name": "Burning Legion"},
            },
            "rank": 0,
        },
        {
            "character": {
                "name": "Jaina",
                "level": 90,
                "playable_class": {"name": "Mage"},
                "playable_race": {"name": "Human"},
                "realm": {"name": "Burning Legion"},
            },
            "rank": 1,
        },
    {
            "character": {
                "name": "Thrall",
                "level": 90,
                "playable_class": {"name": "Shaman"},
                "playable_race": {"name": "Orc"},
                "realm": {"name": "Burning Legion"},
            },
            "rank": 2,
        },
    ],
}

MOCK_CHARACTER = {
    "Arthas": {
        "name": "Arthas",
        "level": 90,
        "character_class": {"name": "Death Knight"},
        "race": {"name": "Human"},
        "average_item_level": 278,
        "equipped_item_level": 275,
        "achievement_points": 15420,
    },
    "Jaina": {
        "name": "Jaina",
        "level": 80,
        "character_class": {"name": "Mage"},
        "race": {"name": "Human"},
        "average_item_level": 265,
        "equipped_item_level": 262,
        "achievement_points": 12300,
    },
}

class BlizzardService:

    async def get_guild_roster(self, realm: str, guild_name: str) -> dict:
        if USE_MOCK:
            return MOCK_ROSTER
        # import httpx
        # async with httpx.AsyncClient() as client:
        #     response = await client.get(
        #         f"https://{BLIZZARD_REGION}.api.blizzard.com/data/wow/guild/{realm}/{guild_name}/roster",
        #         headers={"Authorization": f"Bearer {token}"},
        #         params={"namespace": f"profile-{BLIZZARD_REGION}", "locale": "pl_PL"},
        #     )
        #     return response.json()

    async def get_character(self, realm: str, character_name: str) -> dict:
        if USE_MOCK:
            character = MOCK_CHARACTER.get(character_name)
            if not character:
                return {"blad": f"nie znaleziono postaci {character_name}"}
            return character
        # import httpx
        # async with httpx.AsyncClient() as client:
        #     response = await client.get(...)
        #     return response.json()

blizzard_service = BlizzardService()