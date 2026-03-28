from fastapi import APIRouter
from services.blizzard import blizzard_service

router = APIRouter()


@router.get("/roster/{realm}/{guild_name}")
async def guild_roster(realm: str, guild_name: str):
    data = await blizzard_service.get_guild_roster(realm, guild_name)

    members = []
    for member in data.get("members", []):
        character = member.get("character", {})
        members.append({
            "name":   character.get("name"),
            "level":  character.get("level"),
            "class":  character.get("playable_class", {}).get("name"),
            "race":   character.get("playable_race", {}).get("name"),
            "realm":  character.get("realm", {}).get("name"),
            "rank":   member.get("rank"),
        })
    
    return {
        "guild":        data.get("guild", {}).get("name"),
        "realm":        realm,
        "member_count": len(members),
        "members":      members,
    }

@router.get("/character/{realm}/{character_name}")
async def character_info(realm: str, character_name: str):
    data = await blizzard_service.get_character(realm, character_name)
    return data