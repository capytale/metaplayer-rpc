import { Contracts as LtiVs } from './lti.vs';
import { Contracts as Mathalea } from './mathalea';

export type ContractCollection = {
    'lti.vs:1': LtiVs[0];
    'lti.vs:2': LtiVs[1];
    'mathalea:1': Mathalea[0];
    'mathalea:2': Mathalea[1];
}