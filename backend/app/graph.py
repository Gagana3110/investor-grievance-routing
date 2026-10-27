from typing import Any, TypedDict
from langgraph.graph import END, START, StateGraph

from app.agents.investigator import investigator_node
from app.agents.reviewer import reviewer_node


class RoutingState(TypedDict, total=False):
    complaint_text: str
    entity_name: str | None
    evidence: list[dict[str, Any]]
    proposed_route: dict[str, Any]
    verified: bool
    result: dict[str, Any]


def build_graph():
    workflow = StateGraph(RoutingState)
    workflow.add_node("investigator", investigator_node)
    workflow.add_node("reviewer", reviewer_node)
    workflow.add_edge(START, "investigator")
    workflow.add_edge("investigator", "reviewer")
    workflow.add_edge("reviewer", END)
    return workflow.compile()


routing_graph = build_graph()