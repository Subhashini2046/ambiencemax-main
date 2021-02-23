export interface ReqSchema {
  req_date: string;
  req_id: number;
  req_initiator_id: number;
  req_level: number;
  req_status: string;
  req_number: string;
  req_type: string;
  w_id: number;
  me_type:string;
  req_swon:string;
  budget_type:string;
  available_budget:number;
  consumed_budget:number;
  balance_budget:number;
  req_subject:string;
  req_description: string;
}
