import { PostVisualChangeResponse } from "../../../types/openapi";
import { createApiRequestHandler } from "../../util/handler";
import {
  createVisualChange,
  findExperimentByVisualChangesetId,
} from "../../models/VisualChangesetModel";
import { postVisualChangeValidator } from "../../validators/openapi";

export const postVisualChange = createApiRequestHandler(
  postVisualChangeValidator
)(
  async (req): Promise<PostVisualChangeResponse> => {
    const experiment = await findExperimentByVisualChangesetId(
      req.context,
      req.params.id
    );

    if (!experiment) {
      throw new Error("Experiment not found");
    }

    if (!req.context.permissions.canCreateVisualChange(experiment)) {
      req.context.permissions.throwPermissionError();
    }

    const res = await createVisualChange(
      req.params.id,
      req.organization.id,
      req.body
    );

    return res;
  }
);
