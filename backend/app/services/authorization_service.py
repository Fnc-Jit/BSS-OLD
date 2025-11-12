from typing import Optional
from datetime import datetime
from app.models.user import User, UserRole


class AuthorizationService:
    """Service for handling authorization and access control."""
    
    def __init__(self):
        self.ghost_mode_users = set()  # Track users in ghost mode
    
    def can_create_thread(self, user: User) -> bool:
        """Check if user can create a thread."""
        if user.is_locked:
            return False
        return True
    
    def can_create_post(self, user: User) -> bool:
        """Check if user can create a post."""
        if user.is_locked:
            return False
        return True
    
    def can_edit_post(self, user: User, post_author_id: str) -> bool:
        """Check if user can edit a post."""
        # Admins can edit any post
        if user.role == UserRole.ADMIN:
            return True
        # Users can only edit their own posts
        return user.id == post_author_id
    
    def can_delete_post(self, user: User, post_author_id: str) -> bool:
        """Check if user can delete a post."""
        # Admins can delete any post
        if user.role == UserRole.ADMIN:
            return True
        # Users can only delete their own posts
        return user.id == post_author_id
    
    def can_edit_thread(self, user: User, thread_author_id: str) -> bool:
        """Check if user can edit a thread."""
        # Admins can edit any thread
        if user.role == UserRole.ADMIN:
            return True
        # Users can only edit their own threads
        return user.id == thread_author_id
    
    def can_delete_thread(self, user: User, thread_author_id: str) -> bool:
        """Check if user can delete a thread."""
        # Admins can delete any thread
        if user.role == UserRole.ADMIN:
            return True
        # Users can only delete their own threads
        return user.id == thread_author_id
    
    def can_lock_thread(self, user: User) -> bool:
        """Check if user can lock/unlock threads."""
        return user.role == UserRole.ADMIN
    
    def can_pin_thread(self, user: User) -> bool:
        """Check if user can pin/unpin threads."""
        return user.role == UserRole.ADMIN
    
    def can_access_admin_panel(self, user: User) -> bool:
        """Check if user can access admin panel."""
        return user.role == UserRole.ADMIN
    
    def can_view_moderation_logs(self, user: User) -> bool:
        """Check if user can view moderation logs."""
        return user.role == UserRole.ADMIN
    
    def can_manage_users(self, user: User) -> bool:
        """Check if user can manage other users."""
        return user.role == UserRole.ADMIN
    
    def enable_ghost_mode(self, user_id: str) -> bool:
        """Enable ghost mode for an admin user."""
        self.ghost_mode_users.add(user_id)
        return True
    
    def disable_ghost_mode(self, user_id: str) -> bool:
        """Disable ghost mode for an admin user."""
        self.ghost_mode_users.discard(user_id)
        return True
    
    def is_ghost_mode(self, user_id: str) -> bool:
        """Check if user is in ghost mode."""
        return user_id in self.ghost_mode_users
    
    def is_admin(self, user: User) -> bool:
        """Check if user is an admin."""
        return user.role == UserRole.ADMIN


# Global authorization service instance
authz_service = AuthorizationService()
