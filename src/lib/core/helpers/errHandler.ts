interface ErrorDetails {
  strMessage: string;
  apiStatus: string;
  objDetails: {
    reason: string;
  };
}

interface SetSendOptions {
  statusCode?: number;
}

class errHandler extends Error {
  public message: ErrorDetails;
  public isError: boolean = false;

  constructor(
    message: string | Error | Partial<ErrorDetails> = "SOMETHING_WENT_WRONG",
    errType: string = "errCommon"
  ) {
    super();

    Error.captureStackTrace(this, this.constructor);

    if (errType === "errServer") {
      errType = "errCommon";
      console.log(`\n${new Date().toUTCString()} :-`);
      console.log(message);
    }

    if (typeof message === "object") {
      if (message instanceof Error) {
        console.log(`\n${new Date().toUTCString()} :-`);
        console.log(message);

        this.message = {
          strMessage: (message as any).strMessage || "SOMETHING_WENT_WRONG",
          apiStatus: "error",
          objDetails: (message as any).objDetails || { reason: "unknown" },
        };
      } else {
        this.message = {
          strMessage: message.strMessage || "SOMETHING_WENT_WRONG",
          apiStatus: "error",
          objDetails: message.objDetails || { reason: "unknown" },
        };
      }

      this.isError = true;
    } else {
      this.message = {
        strMessage: message,
        apiStatus: "error",
        objDetails: { reason: "unknown" },
      };
      this.isError = true;
    }
  }

  set({ statusCode = 400 }: SetSendOptions = {}) {
    return {
      ...this.message,
      statusCode,
    };
  }

  send({ statusCode = 400 }: SetSendOptions = {}) {
    return {
      body: this.message,
      statusCode,
    };
  }
}

export default errHandler;
