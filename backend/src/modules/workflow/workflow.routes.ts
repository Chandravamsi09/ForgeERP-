import { Router } from 'express';
import { WORKFLOW_Controller } from './workflow.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();
router.use(authenticateJWT);

router.get('/approvalworkflow', WORKFLOW_Controller.listApprovalWorkflow);
router.get('/approvalworkflow/metrics', WORKFLOW_Controller.getApprovalWorkflowMetrics);
router.get('/approvalworkflow/:id', WORKFLOW_Controller.getApprovalWorkflowById);
router.post('/approvalworkflow', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WORKFLOW_Controller.createApprovalWorkflow);
router.put('/approvalworkflow/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WORKFLOW_Controller.updateApprovalWorkflow);
router.delete('/approvalworkflow/:id', requireRoles(UserRole.ADMIN), WORKFLOW_Controller.deleteApprovalWorkflow);

router.get('/workflownode', WORKFLOW_Controller.listWorkflowNode);
router.get('/workflownode/metrics', WORKFLOW_Controller.getWorkflowNodeMetrics);
router.get('/workflownode/:id', WORKFLOW_Controller.getWorkflowNodeById);
router.post('/workflownode', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WORKFLOW_Controller.createWorkflowNode);
router.put('/workflownode/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WORKFLOW_Controller.updateWorkflowNode);
router.delete('/workflownode/:id', requireRoles(UserRole.ADMIN), WORKFLOW_Controller.deleteWorkflowNode);

router.get('/transitioncondition', WORKFLOW_Controller.listTransitionCondition);
router.get('/transitioncondition/metrics', WORKFLOW_Controller.getTransitionConditionMetrics);
router.get('/transitioncondition/:id', WORKFLOW_Controller.getTransitionConditionById);
router.post('/transitioncondition', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WORKFLOW_Controller.createTransitionCondition);
router.put('/transitioncondition/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WORKFLOW_Controller.updateTransitionCondition);
router.delete('/transitioncondition/:id', requireRoles(UserRole.ADMIN), WORKFLOW_Controller.deleteTransitionCondition);

router.get('/approvalquorum', WORKFLOW_Controller.listApprovalQuorum);
router.get('/approvalquorum/metrics', WORKFLOW_Controller.getApprovalQuorumMetrics);
router.get('/approvalquorum/:id', WORKFLOW_Controller.getApprovalQuorumById);
router.post('/approvalquorum', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WORKFLOW_Controller.createApprovalQuorum);
router.put('/approvalquorum/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WORKFLOW_Controller.updateApprovalQuorum);
router.delete('/approvalquorum/:id', requireRoles(UserRole.ADMIN), WORKFLOW_Controller.deleteApprovalQuorum);

router.get('/auditstep', WORKFLOW_Controller.listAuditStep);
router.get('/auditstep/metrics', WORKFLOW_Controller.getAuditStepMetrics);
router.get('/auditstep/:id', WORKFLOW_Controller.getAuditStepById);
router.post('/auditstep', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WORKFLOW_Controller.createAuditStep);
router.put('/auditstep/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WORKFLOW_Controller.updateAuditStep);
router.delete('/auditstep/:id', requireRoles(UserRole.ADMIN), WORKFLOW_Controller.deleteAuditStep);

router.get('/delegationrule', WORKFLOW_Controller.listDelegationRule);
router.get('/delegationrule/metrics', WORKFLOW_Controller.getDelegationRuleMetrics);
router.get('/delegationrule/:id', WORKFLOW_Controller.getDelegationRuleById);
router.post('/delegationrule', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WORKFLOW_Controller.createDelegationRule);
router.put('/delegationrule/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WORKFLOW_Controller.updateDelegationRule);
router.delete('/delegationrule/:id', requireRoles(UserRole.ADMIN), WORKFLOW_Controller.deleteDelegationRule);

router.get('/escalationpolicy', WORKFLOW_Controller.listEscalationPolicy);
router.get('/escalationpolicy/metrics', WORKFLOW_Controller.getEscalationPolicyMetrics);
router.get('/escalationpolicy/:id', WORKFLOW_Controller.getEscalationPolicyById);
router.post('/escalationpolicy', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WORKFLOW_Controller.createEscalationPolicy);
router.put('/escalationpolicy/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WORKFLOW_Controller.updateEscalationPolicy);
router.delete('/escalationpolicy/:id', requireRoles(UserRole.ADMIN), WORKFLOW_Controller.deleteEscalationPolicy);
export default router;
