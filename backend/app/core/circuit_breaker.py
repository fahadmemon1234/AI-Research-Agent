import time
from enum import Enum
from typing import Callable, Any
from app.core.logging_config import log_info, log_error

class State(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"

class CircuitBreaker:
    def __init__(self, failure_threshold: int = 5, recovery_timeout: int = 60, expected_exception: type = Exception):
        """
        Initialize the circuit breaker
        
        Args:
            failure_threshold: Number of failures before opening the circuit
            recovery_timeout: Time in seconds to wait before attempting reset
            expected_exception: Exception type to watch for failures
        """
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.expected_exception = expected_exception
        
        self._failure_count = 0
        self._last_failure_time = None
        self._state = State.CLOSED
        
        log_info(f"CircuitBreaker initialized with threshold: {failure_threshold}, timeout: {recovery_timeout}s")

    def call(self, func: Callable, *args, **kwargs) -> Any:
        """
        Call the function with circuit breaker protection
        """
        if self._state == State.OPEN:
            if self._should_attempt_reset():
                self._state = State.HALF_OPEN
                log_info("Circuit breaker transitioning to HALF_OPEN state")
            else:
                log_info("Circuit breaker OPEN - call rejected")
                raise Exception("Circuit breaker is OPEN")
        
        try:
            result = func(*args, **kwargs)
            
            if self._state == State.HALF_OPEN:
                # Success in half-open state means we can close the circuit
                self._close()
            
            return result
        except self.expected_exception as e:
            self._handle_error()
            raise e
        except Exception as e:
            # Unexpected exception - treat as failure
            self._handle_error()
            raise e

    def _handle_error(self):
        """
        Handle a failure by incrementing counter and possibly opening circuit
        """
        self._failure_count += 1
        self._last_failure_time = time.time()
        
        log_info(f"Circuit breaker failure #{self._failure_count}")
        
        if self._failure_count >= self.failure_threshold:
            self._open()
    
    def _open(self):
        """
        Open the circuit breaker
        """
        self._state = State.OPEN
        log_info("Circuit breaker OPENED due to failure threshold reached")
    
    def _close(self):
        """
        Close the circuit breaker
        """
        self._state = State.CLOSED
        self._failure_count = 0
        self._last_failure_time = None
        log_info("Circuit breaker CLOSED after successful call")
    
    def _should_attempt_reset(self) -> bool:
        """
        Check if enough time has passed to attempt resetting the circuit
        """
        if self._last_failure_time is None:
            return False
        
        return time.time() - self._last_failure_time >= self.recovery_timeout

    def reset(self):
        """
        Manually reset the circuit breaker
        """
        self._state = State.CLOSED
        self._failure_count = 0
        self._last_failure_time = None
        log_info("Circuit breaker manually RESET")


# Decorator version for easier use
def circuit_breaker(failure_threshold: int = 5, recovery_timeout: int = 60, expected_exception: type = Exception):
    """
    Decorator to apply circuit breaker pattern to a function
    """
    cb = CircuitBreaker(failure_threshold, recovery_timeout, expected_exception)
    
    def decorator(func):
        def wrapper(*args, **kwargs):
            return cb.call(func, *args, **kwargs)
        return wrapper
    return decorator