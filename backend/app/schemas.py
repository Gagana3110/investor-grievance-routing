from datetime import datetime, timezone
from enum import Enum
from pydantic import BaseModel, Field, field_validator

class EntityDomain(str, Enum):
    broker = "broker"
    mutual_fund = "mutual_fund"
    registrar = "registrar"
    listed_company = "listed_company"
    depository = "depository"
    bank_or_other = "bank_or_other"
    unknown = "unknown"

class ComplaintRequest(BaseModel):
    complaint_text: str = Field(min_length=20, max_length=8000)
    product_type: str | None = Field(default=None, max_length=120)
    entity_name: str | None = Field(default=None, max_length=200)
    entity_type: EntityDomain | None = None
    prior_complaint_reference: str | None = Field(default=None, max_length=120)
    consent_to_process: bool = True

    @field_validator("complaint_text")
    @classmethod
    def not_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("complaint_text must not be blank")
        return value.strip()

class Citation(BaseModel):
    source_title: str
    source_version: str
    section: str
    passage: str
    source_url: str | None = None

class RoutingResult(BaseModel):
    status: str
    route_type: str
    recommended_regulator: str | None = None
    responsible_entity: str | None = None
    timeline: str | None = None
    reason: str
    citations: list[Citation] = []
    escalation_reason: str | None = None
    human_review_required: bool = True
    prompt_version: str = "routing-v0.1"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
