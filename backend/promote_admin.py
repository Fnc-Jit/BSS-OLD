"""
Utility script to promote a user to admin role.
Usage: python promote_admin.py <email>
"""
import asyncio
import sys
from app.core.database import db_manager
from app.repositories.user_repository import UserRepository


async def promote_user_to_admin(email: str):
    """Promote a user to admin by email."""
    await db_manager.connect()
    
    db = db_manager.get_default_database()
    user_repo = UserRepository(db)
    
    # Find user by email
    user = await user_repo.get_user_by_email(email)
    if not user:
        print(f"❌ User with email {email} not found")
        await db_manager.close()
        return
    
    # Promote to admin
    updated_user = await user_repo.promote_to_admin(user.id)
    if updated_user:
        print(f"✅ User {updated_user.username} ({updated_user.email}) promoted to admin")
        print(f"   User ID: {updated_user.id}")
        print(f"   Role: {updated_user.role}")
    else:
        print(f"❌ Failed to promote user")
    
    await db_manager.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python promote_admin.py <email>")
        sys.exit(1)
    
    email = sys.argv[1]
    asyncio.run(promote_user_to_admin(email))
