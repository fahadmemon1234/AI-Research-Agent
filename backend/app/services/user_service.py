from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.auth import hash_password
from app.core.logging_config import log_info, log_error

class UserService:
    @staticmethod
    def create_user(db: Session, user: UserCreate) -> User:
        """
        Create a new user in the database
        """
        try:
            # Hash the password (truncation handled in hash_password function)
            hashed_password = hash_password(user.password)

            # Create the user object
            db_user = User(
                email=user.email,
                password_hash=hashed_password,
                first_name=user.first_name,
                last_name=user.last_name
            )

            # Add to database
            db.add(db_user)
            db.commit()
            db.refresh(db_user)

            log_info(f"User created successfully with ID: {db_user.id}")
            return db_user
        except Exception as e:
            db.rollback()
            log_error(e, f"Error creating user with email: {user.email}")
            raise

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """
        Get a user by email
        """
        try:
            user = db.query(User).filter(User.email == email).first()
            if user:
                log_info(f"User found with email: {email}")
            else:
                log_info(f"No user found with email: {email}")
            return user
        except Exception as e:
            log_error(e, f"Error retrieving user with email: {email}")
            raise

    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
        """
        Get a user by ID
        """
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                log_info(f"User found with ID: {user_id}")
            else:
                log_info(f"No user found with ID: {user_id}")
            return user
        except Exception as e:
            log_error(e, f"Error retrieving user with ID: {user_id}")
            raise

    @staticmethod
    def update_user(db: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
        """
        Update a user's information
        """
        try:
            db_user = db.query(User).filter(User.id == user_id).first()
            if not db_user:
                log_info(f"User not found with ID: {user_id}")
                return None
            
            # Update fields
            if user_update.first_name is not None:
                db_user.first_name = user_update.first_name
            if user_update.last_name is not None:
                db_user.last_name = user_update.last_name
            
            db.commit()
            db.refresh(db_user)
            
            log_info(f"User updated successfully with ID: {user_id}")
            return db_user
        except Exception as e:
            db.rollback()
            log_error(e, f"Error updating user with ID: {user_id}")
            raise

    @staticmethod
    def delete_user(db: Session, user_id: int) -> bool:
        """
        Delete a user
        """
        try:
            db_user = db.query(User).filter(User.id == user_id).first()
            if not db_user:
                log_info(f"User not found with ID: {user_id}")
                return False
            
            db.delete(db_user)
            db.commit()
            
            log_info(f"User deleted successfully with ID: {user_id}")
            return True
        except Exception as e:
            db.rollback()
            log_error(e, f"Error deleting user with ID: {user_id}")
            raise